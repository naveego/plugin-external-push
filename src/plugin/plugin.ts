import {
    ServerUnaryCall,
    sendUnaryData,
    ServerWritableStream,
    ServerDuplexStream,
} from '@grpc/grpc-js';

import { 
    BeginOAuthFlowRequest,
    BeginOAuthFlowResponse,
    CompleteOAuthFlowRequest,
    CompleteOAuthFlowResponse,
    ConfigurationFormResponse,
    ConfigureConnectionRequest,
    ConfigureConnectionResponse,
    ConfigureQueryRequest,
    ConfigureQueryResponse,
    ConfigureRealTimeRequest,
    ConfigureRealTimeResponse,
    ConfigureReplicationRequest,
    ConfigureReplicationResponse,
    ConfigureRequest, 
    ConfigureResponse, 
    ConfigureWriteRequest, 
    ConfigureWriteResponse, 
    ConnectRequest,
    ConnectResponse,
    DisconnectRequest,
    DisconnectResponse,
    DiscoverRelatedEntitiesRequest,
    DiscoverRelatedEntitiesResponse,
    DiscoverSchemasRequest,
    DiscoverSchemasResponse,
    PrepareWriteRequest,
    PrepareWriteResponse,
    PropertyType,
    ReadRequest,
    Record,
    RecordAck,
    Schema
} from '../proto/publisher_pb';

import { IPublisherServer} from '../proto/publisher_grpc_pb';
import { Logger } from '../logger/logger';
import { Settings, ValidateSettings } from '../helper/settings';
import { ServerStatus } from '../helper/server-status';
import * as fs from 'fs';
import { GetAllSchemas } from '../api/discover/get-all-schemas';
import express from "express";
import _, { Dictionary } from 'lodash';
import * as ReadConfig from '../api/read/get-schema-json';

// global plugin constants
let logger = new Logger();
let serverStatus: ServerStatus = {
    connected: false,
    settings: {
        port: 0,
        tokenValidationEndpoint: '',
        inputSchema: []
    }, 
    expressServer: undefined
};

// common implementations
function waitForDisconnect(): void {
    if (!serverStatus.connected) {
        setTimeout(waitForDisconnect, 1000);
    }
}

async function connectImpl(request: ConnectRequest): Promise<ConnectResponse>
{
    logger.SetLogPrefix("connect");
    logger.Info('Connecting...');

    // validate settings passed in
    logger.Info("Validating settings");
    try {
        let settings: Settings = {
            port: 0,
            tokenValidationEndpoint: '',
            inputSchema: []
        };
        let parsed = JSON.parse(request.getSettingsJson());
        Object.assign(settings, parsed);

        // assign settings to global context
        serverStatus.settings = settings;
    } catch (error: any) {
        logger.Error(error);

        let response = new ConnectResponse();
        response.setSettingsError(error.toString())
        return response;
    }

    try {
        ValidateSettings(serverStatus.settings);
    } catch (error: any) {
        logger.Error(error);

        let response = new ConnectResponse();
        response.setSettingsError(error.toString())
        return response;
    }

    serverStatus.connected = true;

    logger.Info('Settings validated');

    let response = new ConnectResponse();

    return response;
}

export class Plugin implements IPublisherServer {

    [name: string]: import("@grpc/grpc-js").UntypedHandleCall;
    
    configure(call: ServerUnaryCall<ConfigureRequest, ConfigureResponse>, callback: sendUnaryData<ConfigureResponse>) {
        // ensure all directories
        let tempDir = call.request.getTemporaryDirectory();
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        let permanentDir = call.request.getPermanentDirectory();
        if (!fs.existsSync(permanentDir)) {
            fs.mkdirSync(permanentDir);
        }

        let logDir = call.request.getLogDirectory();
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }

        // configure logger
        logger.SetLogLevel(call.request.getLogLevel());
        serverStatus.config = call.request;

        callback(null, new ConfigureResponse());
    };

    async connect(call: ServerUnaryCall<ConnectRequest, ConnectResponse>, callback: sendUnaryData<ConnectResponse>) {
        callback(null, await connectImpl(call.request));
    }

    async connectSession(call: ServerWritableStream<ConnectRequest, ConnectResponse>) {
        call.write(await connectImpl(call.request));

        // sit forever and don't block
        waitForDisconnect();
        call.end();
    }

    async discoverSchemas(call: ServerUnaryCall<DiscoverSchemasRequest, DiscoverSchemasResponse>, callback: sendUnaryData<DiscoverSchemasResponse>) {
        logger.SetLogPrefix("discover");
        logger.Info("Discovering schemas...");

        // get schemas
        let response = new DiscoverSchemasResponse();

        logger.Info("Schemas found: 1");
        let schema = await GetAllSchemas(logger, serverStatus.settings, call.request.getSampleSize());
        response.setSchemasList(schema);

        if (call.request.getMode() === DiscoverSchemasRequest.Mode.REFRESH)
        {
            let refreshSchemas = call.request.getToRefreshList();
            // TODO: Refresh schema
        
            logger.Debug(`Schemas found: ${JSON.stringify([schema])}`);
            logger.Debug(`Refresh requested on schema: ${JSON.stringify(refreshSchemas)}`);
        }

        logger.Info("Schemas returned: 1");
        callback(null, response);
    }

    async configureRealTime(call: ServerUnaryCall<ConfigureRealTimeRequest, ConfigureRealTimeResponse>, callback: sendUnaryData<ConfigureRealTimeResponse>) {
        logger.Info("Configuring real time...");

        let schemaJson = (await ReadConfig.GetSchemaJson()) ?? "";
        let uiJson = (await ReadConfig.GetUIJson()) ?? "";

        let response = new ConfigureRealTimeResponse();

        let configFormResponse = new ConfigurationFormResponse();

        let dataJson = call.request.getForm()?.getDataJson() ?? "";
        let stateJson = call.request.getForm()?.getStateJson() ?? "";

        configFormResponse.setDataJson(dataJson);
        configFormResponse.setDataErrorsJson("");
        configFormResponse.setErrorsList([]);
        configFormResponse.setSchemaJson(schemaJson);
        configFormResponse.setUiJson(uiJson);
        configFormResponse.setStateJson(stateJson);

        response.setForm(configFormResponse);
        
        return response;
    }

    async readStream(call: ServerWritableStream<ReadRequest, Record>) {
        if (call.request.getRealTimeSettingsJson()) {
            // close existing server if open
            serverStatus?.expressServer?.close();

            // build express server
            const app = express();
            const port = serverStatus.settings.port;

            app.post("/externalpush", (req, res, next) => {
                try {
                    // get input data
                    let data = req.body;

                    // get input schema
                    let schema = call.request.getSchema();
                    if (_.isNil(schema)) {
                        throw new Error("Cannot start read stream: Input schema is undefined");
                    }

                    // build record
                    let recordMap: Dictionary<any> = {};
                    for (let i = 0; i < schema.getPropertiesList().length; i++) {
                        const property = schema.getPropertiesList()[i];
                        const propId = property.getId();
                        try {
                            switch (property.getType()) {
                                case PropertyType.STRING:
                                case PropertyType.TEXT:
                                case PropertyType.DECIMAL:
                                    recordMap[propId] = `${data?.[propId]}`;
                                    break;
                                default:
                                    recordMap[propId] = data?.[propId];
                                    break;
                            }
                        }
                        catch (e: any) {
                            if (_.isError(e)) {
                                logger.Error(e, `No column with property id: ${propId}\n` + e.message);
                            }
                            else {
                                logger.Error(e, `No column with property id: ${propId}\n${e}`);
                            }
                            recordMap[propId] = null;
                        }
                    }

                    let record = new Record();
                    record.setAction(Record.Action.UPSERT);
                    record.setDataJson(JSON.stringify(recordMap));

                    // upload record to agent
                    call.write(record);

                    // send response to api request
                    res.sendStatus(200);
                } catch (error: any) {
                    logger.Error(error);
                    next(error);
                }
            });

            // start the express server
            serverStatus.expressServer = app.listen(port, () => {
                logger.Info(`input server started at http://localhost:${ port }`);
            });
        }

        call.end();
    }

    disconnect(call: ServerUnaryCall<DisconnectRequest , DisconnectResponse>, callback: sendUnaryData<DisconnectResponse>) {
        serverStatus?.expressServer?.close();

        serverStatus = {
            connected: false,
            settings: {
                port: 0,
                tokenValidationEndpoint: '',
                inputSchema: []
            },
            expressServer: undefined
        };
    
        callback(null, new DisconnectResponse());
    }

    // not implemented
    beginOAuthFlow(call: ServerUnaryCall<BeginOAuthFlowRequest, BeginOAuthFlowResponse>, callback: sendUnaryData<BeginOAuthFlowResponse>) {
        throw new Error("not Implemented");
    }
    completeOAuthFlow(call: ServerUnaryCall<CompleteOAuthFlowRequest, CompleteOAuthFlowResponse>, callback: sendUnaryData<CompleteOAuthFlowResponse>) {
        throw new Error("not Implemented");
    }
    configureConnection(call: ServerUnaryCall<ConfigureConnectionRequest, ConfigureConnectionResponse>, callback: sendUnaryData<ConfigureConnectionResponse>) {
        throw new Error("not Implemented");
    }
    configureQuery(call: ServerUnaryCall<ConfigureQueryRequest, ConfigureQueryResponse>, callback: sendUnaryData<ConfigureQueryResponse>) {
        throw new Error("not Implemented");
    }
    discoverShapes(call: ServerUnaryCall<DiscoverSchemasRequest, DiscoverSchemasResponse>, callback: sendUnaryData<DiscoverSchemasResponse>) {
        throw new Error("not Implemented");
    }
    discoverSchemasStream(call: ServerWritableStream<DiscoverSchemasRequest, Schema>) {
        throw new Error("not Implemented");
    }
    discoverRelatedEntities(call: ServerUnaryCall<DiscoverRelatedEntitiesRequest, DiscoverRelatedEntitiesResponse>, callback: sendUnaryData<DiscoverRelatedEntitiesResponse>) {
        throw new Error("not Implemented");
    }
    publishStream(call: ServerWritableStream<ReadRequest, Record>) {
        throw new Error("not Implemented");
    }
    configureWrite(call: ServerUnaryCall<ConfigureWriteRequest, ConfigureWriteResponse>, callback: sendUnaryData<ConfigureWriteResponse>) {
        throw new Error("not Implemented");
    }
    configureReplication(call: ServerUnaryCall<ConfigureReplicationRequest, ConfigureReplicationResponse>, callback: sendUnaryData<ConfigureReplicationResponse>) {
        throw new Error("not Implemented");
    }
    prepareWrite(call: ServerUnaryCall<PrepareWriteRequest, PrepareWriteResponse>, callback: sendUnaryData<PrepareWriteResponse>) {
        throw new Error("not Implemented");
    }
    writeStream(call: ServerDuplexStream<Record, RecordAck>) {
        throw new Error("not Implemented");
    }
}
