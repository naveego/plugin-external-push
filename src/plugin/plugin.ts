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
import path from "path";

// global plugin constants
var logger = new Logger();
var serverStatus: ServerStatus = {
    connected: false,
    settings: {
        port: 0,
        tokenValidationEndpoint: '',
        inputSchema: []
    }, 
    expressServer: undefined
};

// common implementations
function waitForDisconnect (): void {
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
        var parsed = JSON.parse(request.getSettingsJson());
        Object.assign(settings, parsed);

        // assign settings to global context
        serverStatus.settings = settings;
    } catch (error: any) {
        logger.Error(error.toString());

        var response = new ConnectResponse();
        response.setSettingsError(error.toString())
        return response;
    }

    try {
        ValidateSettings(serverStatus.settings);
    } catch (error: any) {
        logger.Error(error.toString());

        var response = new ConnectResponse();
        response.setSettingsError(error.toString())
        return response;
    }

    serverStatus.connected = true;

    logger.Info('Settings validated');

    var response = new ConnectResponse();

    return response;
}

export class Plugin implements IPublisherServer {

    [name: string]: import("@grpc/grpc-js").UntypedHandleCall;
    
    configure(call: ServerUnaryCall<ConfigureRequest, ConfigureResponse>, callback:sendUnaryData<ConfigureResponse>) {
        // ensure all directories
        if (!fs.existsSync(call.request.getTemporaryDirectory())) {
            fs.mkdirSync(call.request.getTemporaryDirectory());
        }

        if (!fs.existsSync(call.request.getPermanentDirectory())) {
            fs.mkdirSync(call.request.getPermanentDirectory());
        }

        if (!fs.existsSync(call.request.getLogDirectory())) {
            fs.mkdirSync(call.request.getLogDirectory());
        }

        // configure logger
        logger.SetLogLevel(call.request.getLogLevel());
        serverStatus.config = call.request;

        let response = new ConfigureResponse();
        callback(null, response);
    };

    async connect(call: ServerUnaryCall<ConnectRequest, ConnectResponse>, callback:sendUnaryData<ConnectResponse>) {
        var response = await connectImpl(call.request);
    
        callback(null, response);
    }

    async connectSession(call: ServerWritableStream<ConnectRequest, ConnectResponse>) {
        var response = await connectImpl(call.request);
        
        call.write(response);
    
        // sit forever and don't block
        waitForDisconnect();
        call.end();
    }

    async discoverSchemas(call: ServerUnaryCall<DiscoverSchemasRequest, DiscoverSchemasResponse>, callback:sendUnaryData<DiscoverSchemasResponse>) {
        var schemas: Schema[];

        // get schemas
        schemas = await GetAllSchemas(logger, serverStatus.settings, call.request.getSampleSize());
        
        var response = new DiscoverSchemasResponse();
        response.setSchemasList(schemas);
    
        callback(null, response);
    }

    configureRealTime(call: ServerUnaryCall<ConfigureRealTimeRequest, ConfigureRealTimeResponse>, callback:sendUnaryData<ConfigureRealTimeResponse>) {
        var response = new ConfigureRealTimeResponse();

        // TODO: implement
        
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

                    // build record
                    var record = new Record();

                    //TODO: add data to record and add fields to record

                    // upload record to agent
                    call.write(record);

                    // send response to api request
                    res.sendStatus(200);
                } catch (error: any) {
                    logger.Error(error.toString());
                    next(error);
                }
            })

            // start the express server
            serverStatus.expressServer = app.listen( port, () => {
                logger.Info(`input server started at http://localhost:${ port }`);
            });
        }

        call.end();
    }

    disconnect(call: ServerUnaryCall<DisconnectRequest , DisconnectResponse>, callback:sendUnaryData<DisconnectResponse>) {
        var response = new DisconnectResponse();

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
    
        callback(null, response);
    }

    // not implemented
    beginOAuthFlow(call: ServerUnaryCall<BeginOAuthFlowRequest, BeginOAuthFlowResponse>, callback:sendUnaryData<BeginOAuthFlowResponse>) {
        throw new Error("not Implemented");
    }
    completeOAuthFlow(call: ServerUnaryCall<CompleteOAuthFlowRequest, CompleteOAuthFlowResponse>, callback:sendUnaryData<CompleteOAuthFlowResponse>) {
        throw new Error("not Implemented");
    }
    configureConnection(call: ServerUnaryCall<ConfigureConnectionRequest, ConfigureConnectionResponse>, callback:sendUnaryData<ConfigureConnectionResponse>) {
        throw new Error("not Implemented");
    }
    configureQuery(call: ServerUnaryCall<ConfigureQueryRequest, ConfigureQueryResponse>, callback:sendUnaryData<ConfigureQueryResponse>) {
        throw new Error("not Implemented");
    }
    discoverShapes(call: ServerUnaryCall<DiscoverSchemasRequest, DiscoverSchemasResponse>, callback:sendUnaryData<DiscoverSchemasResponse>) {
        throw new Error("not Implemented");
    }
    discoverSchemasStream(call: ServerWritableStream<DiscoverSchemasRequest, Schema>) {
        throw new Error("not Implemented");
    }
    discoverRelatedEntities(call: ServerUnaryCall<DiscoverRelatedEntitiesRequest, DiscoverRelatedEntitiesResponse>, callback:sendUnaryData<DiscoverRelatedEntitiesResponse>) {
        throw new Error("not Implemented");
    }
    publishStream(call: ServerWritableStream<ReadRequest, Record>) {
        throw new Error("not Implemented");
    }
    configureWrite(call: ServerUnaryCall<ConfigureWriteRequest, ConfigureWriteResponse>, callback:sendUnaryData<ConfigureWriteResponse>) {
        throw new Error("not Implemented");
    }
    configureReplication(call: ServerUnaryCall<ConfigureReplicationRequest, ConfigureReplicationResponse>, callback:sendUnaryData<ConfigureReplicationResponse>) {
        throw new Error("not Implemented");
    }
    prepareWrite(call: ServerUnaryCall<PrepareWriteRequest, PrepareWriteResponse>, callback:sendUnaryData<PrepareWriteResponse>) {
        throw new Error("not Implemented");
    }
    writeStream(call: ServerDuplexStream<Record, RecordAck>) {
        throw new Error("not Implemented");
    }
}
