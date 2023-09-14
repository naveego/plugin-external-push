import _, { Dictionary } from 'lodash';
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

import { IPublisherServer } from '../proto/publisher_grpc_pb';
import { LogParams, Logger } from '../logger/logger';
import { Settings, ValidateSettings } from '../helper/settings';
import { ServerStatus } from '../helper/server-status';
import * as fs from 'fs';
import { GetAllSchemas } from '../api/discover/get-all-schemas';
import express from 'express';
import * as ReadConfig from '../api/read/real-time-configure-json';
import { getAppRootDirectory } from '../main';
import path from 'path';
import { RealTimeSettings, RealTimeState } from '../api/read/real-time-types';
import moment from 'moment';

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

function connectImpl(request: ConnectRequest): ConnectResponse {
    logger.SetLogPrefix('connect');
    logger.Info('Connecting...');

    // validate settings passed in
    logger.Info('Validating settings');
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

function buildRecordMap(
    call: ServerWritableStream<ReadRequest, Record>,
    data: any,
    logParams?: LogParams
): Dictionary<any> {
    let error: Error;
    if (data === null || data === undefined) {
        error = new Error('Incoming request data is null or undefined');
        logger.Error(error, 'Cannot build record', logParams);
        throw error;
    }

    // get input schema
    let schema = call.request.getSchema();
    if (_.isNil(schema)) {
        error = new Error('Input schema is undefined');
        logger.Error(error, 'Cannot build record', logParams);
        throw error;
    }

    // build record
    logger.Info('Building record...', logParams);
    let recordMap: Dictionary<any> = {};
    for (let i = 0; i < schema.getPropertiesList().length; i++) {
        const property = schema.getPropertiesList()[i];
        const propId = property.getId();
        const lookupValue = data?.[propId];

        if (_.isNil(lookupValue)) {
            recordMap[propId] = null;
            continue;
        }

        try {
            switch (property.getType()) {
                case PropertyType.DATETIME:
                    if (_.isDate(lookupValue) || _.isString(lookupValue))
                        recordMap[propId] = moment(lookupValue).utc().toISOString();
                    else
                        recordMap[propId] = null;
                    break;
                case PropertyType.JSON:
                    if (_.isPlainObject(lookupValue))
                        recordMap[propId] = lookupValue;
                    else
                        recordMap[propId] = null;
                    break;
                case PropertyType.STRING:
                    recordMap[propId] = `${lookupValue}`;
                    break;
                case PropertyType.INTEGER:
                    if (_.isSafeInteger(lookupValue)) {
                        recordMap[propId] = lookupValue;
                        break;
                    }
                    else if (!_.isNumber(lookupValue)) {
                        recordMap[propId] = null;
                        break;
                    }
                default:
                    recordMap[propId] = lookupValue;
                    break;
            }
        }
        catch (err) {
            let formatError: Error;
            if (_.isError(err)) formatError = err;
            else if (_.isString(err)) formatError = new Error(err);
            else formatError = new Error();

            recordMap[propId] = null;
            logger.Warn('Defaulting to null due to a parse error', {
                ...logParams,
                prop: property.getName() ?? `${i}`
            });
            logger.Debug('Error while building record map', {
                ...logParams,
                prop: property.getName() ?? `${i}`,
                error: formatError
            });
        }
    }

    return recordMap;
}

export class Plugin implements IPublisherServer {

    [name: string]: import('@grpc/grpc-js').UntypedHandleCall;
    
    configure(call: ServerUnaryCall<ConfigureRequest, ConfigureResponse>, callback: sendUnaryData<ConfigureResponse>) {
        // ensure all directories
        let cwd = getAppRootDirectory();
        const recursive = true;

        let tempDir = path.join(cwd, call.request.getTemporaryDirectory());
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive });
        }

        let permanentDir = path.join(cwd, call.request.getPermanentDirectory());
        if (!fs.existsSync(permanentDir)) {
            fs.mkdirSync(permanentDir, { recursive });
        }

        let logDir = path.join(cwd, call.request.getLogDirectory());
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive });
        }

        // configure logger
        let dateString = (new Date()).toISOString().slice(0, 10);
        let logTargetFile = path.join(logDir, `plugin-external-push-log__${dateString}`);

        logger.init(logTargetFile);
        logger.SetLogLevel(call.request.getLogLevel());
        serverStatus.config = call.request;

        callback(null, new ConfigureResponse());
    }

    connect(call: ServerUnaryCall<ConnectRequest, ConnectResponse>, callback: sendUnaryData<ConnectResponse>) {
        callback(null, connectImpl(call.request));
    }

    connectSession(call: ServerWritableStream<ConnectRequest, ConnectResponse>) {
        call.write(connectImpl(call.request));

        // sit forever and don't block
        waitForDisconnect();
        call.end();
    }

    async discoverSchemas(call: ServerUnaryCall<DiscoverSchemasRequest, DiscoverSchemasResponse>, callback: sendUnaryData<DiscoverSchemasResponse>) {
        logger.SetLogPrefix('discover');
        logger.Info('Discovering schemas...');

        // get schemas
        let response = new DiscoverSchemasResponse();

        let schemas = await GetAllSchemas(logger, serverStatus.settings, call.request.getSampleSize());
        logger.Info(`Schemas found: ${schemas?.length ?? 0}`);
        response.setSchemasList(schemas);

        // if (call.request.getMode() === DiscoverSchemasRequest.Mode.REFRESH)
        // {
        //     let refreshSchemas = call.request.getToRefreshList();
        //     // TODO: Refresh schema
        
        //     logger.Debug(`Schemas found: ${schemas.map(s => s.toObject())}`);
        //     logger.Debug(`Refresh requested on schema: ${JSON.stringify(refreshSchemas)}`);
        //     return;
        // }

        logger.Info(`Schemas returned: ${schemas?.length ?? 0}`);
        callback(null, response);
    }

    async configureRealTime(call: ServerUnaryCall<ConfigureRealTimeRequest, ConfigureRealTimeResponse>, callback: sendUnaryData<ConfigureRealTimeResponse>) {
        logger.SetLogPrefix('configure-real-time');
        logger.Info('Configuring real time...');

        const schemaJson = ReadConfig.GetSchemaJson();
        const uiJson = ReadConfig.GetUIJson();

        let response = new ConfigureRealTimeResponse();

        let configFormResponse = new ConfigurationFormResponse();

        // TODO: Validate data and state json
        let dataJson = call.request.getForm()?.getDataJson() ?? '';
        let stateJson = call.request.getForm()?.getStateJson() ?? '';

        configFormResponse.setDataJson(dataJson);
        configFormResponse.setDataErrorsJson('');
        configFormResponse.setErrorsList([]);
        configFormResponse.setSchemaJson(schemaJson);
        configFormResponse.setUiJson(uiJson);
        configFormResponse.setStateJson(stateJson);

        response.setForm(configFormResponse);

        callback(null, response);
    }

    async readStream(call: ServerWritableStream<ReadRequest, Record>) {
        const reportReadStreamError = (error?: Error, logParams?: LogParams) => {
            error ??= new Error('Only Real Time Read jobs are supported by this plugin (Job schedule)');
            logger.Error(error, 'Unable to start read stream', logParams);
            call.destroy(error);
        };

        logger.SetLogPrefix('read-stream');

        // validate incoming request data
        let realTimeSettingsStr = call.request.getRealTimeSettingsJson();
        let realTimeStateStr = call.request.getRealTimeStateJson();

        logger.Debug('Received Read Request', {
            real_time_settings: realTimeSettingsStr,
            real_time_state: realTimeStateStr
        });

        if (_.isEmpty(realTimeSettingsStr)) {
            reportReadStreamError(); return;
        }

        let realTimeSettingsJson: string = '';
        try { realTimeSettingsJson = JSON.parse(realTimeSettingsStr); }
        catch {
            reportReadStreamError(new Error('Cannot parse real time settings'), { json: realTimeSettingsStr });
            return;
        }

        if (_.isEmpty(realTimeSettingsJson)) {
            reportReadStreamError(); return;
        }

        let [err, realTimeSettings] = RealTimeSettings.tryParse(realTimeSettingsJson);
        if (!_.isNil(err)) {
            reportReadStreamError(err); return;
        }

        let realTimeState: any = {};
        try { realTimeState = JSON.parse(realTimeStateStr); }
        catch { logger.Debug('Cannot parse real time state; will use empty object', { json: realTimeStateStr }); }

        // real stream settings validated
        // Keep call open until stream is destroyed
        const logParams: LogParams = {
            'channel_name': realTimeSettings?.channelName?.trim?.() ?? '',
        };

        if (!_.isEmpty(realTimeState)) {
            logParams['job_version'] = realTimeState.jobVersion;
        }

        logger.Info(`Starting read stream...`, logParams);

        // close existing server if open
        if (serverStatus?.expressServer) {
            logger.Warn(`Server already running. Restarting...`, logParams);
            serverStatus?.expressServer?.close();
        }

        // build express server
        const app = express();
        const port = serverStatus.settings.port;

        app.use(express.json());

        // Posting data to the agent
        app.post('/externalpush', (req, res, next) => {
            try {
                let data = req.body;
                logger.Info(`Received post request`, logParams);

                const recordMap = buildRecordMap(call, data, logParams);

                let record = new Record();
                record.setAction(Record.Action.UPSERT);
                record.setDataJson(JSON.stringify(recordMap));

                // upload record to agent
                logger.Info('Sent record for Upsert', logParams);
                call.write(record);

                // send response to api request
                res.sendStatus(200);
            }
            catch (error: any) {
                logger.Error(error, 'Post request resulted in an error', logParams);
                res.sendStatus(500);
                next(error);
            }
        });

        // Deleting data from the agent
        app.delete('/externalpush', (req, res, next) => {
            try {
                // get input data
                let data = req.body;
                logger.Info('Received delete request', logParams);
                
                const recordMap = buildRecordMap(call, data, logParams);

                let record = new Record();
                record.setAction(Record.Action.DELETE);
                record.setDataJson(JSON.stringify(recordMap));

                // upload record to agent
                call.write(record);
                logger.Info('Sent record for Delete', logParams);

                // send response to api request
                res.sendStatus(200);
            }
            catch (error: any) {
                logger.Error(error, 'Delete request resulted in an error', logParams);
                res.sendStatus(500);
                next(error);
            }
        });

        //InjectAuthenticationMiddleware(app);

        app.on('exit', () => {
            logger.Info('input server stopped, ending read stream...', logParams);

            try {
                call.end();
            }
            catch (e) {
                logger.Warn(`could not close read stream: ${e}`, logParams);
            }
        });

        // start the express server
        serverStatus.expressServer = app.listen(port, () => {
            logger.Info(`input server started at http://localhost:${port}`, logParams);
        });
    }

    async disconnect(call: ServerUnaryCall<DisconnectRequest, DisconnectResponse>, callback: sendUnaryData<DisconnectResponse>) {
        logger.SetLogPrefix('disconnect');
        logger.Info('Disconnecting...');

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

        logger.Flush();
    
        callback(null, new DisconnectResponse());
    }

    // not implemented
    beginOAuthFlow(call: ServerUnaryCall<BeginOAuthFlowRequest, BeginOAuthFlowResponse>, callback: sendUnaryData<BeginOAuthFlowResponse>) {
        throw new Error('not Implemented');
    }
    completeOAuthFlow(call: ServerUnaryCall<CompleteOAuthFlowRequest, CompleteOAuthFlowResponse>, callback: sendUnaryData<CompleteOAuthFlowResponse>) {
        throw new Error('not Implemented');
    }
    configureConnection(call: ServerUnaryCall<ConfigureConnectionRequest, ConfigureConnectionResponse>, callback: sendUnaryData<ConfigureConnectionResponse>) {
        throw new Error('not Implemented');
    }
    configureQuery(call: ServerUnaryCall<ConfigureQueryRequest, ConfigureQueryResponse>, callback: sendUnaryData<ConfigureQueryResponse>) {
        throw new Error('not Implemented');
    }
    discoverShapes(call: ServerUnaryCall<DiscoverSchemasRequest, DiscoverSchemasResponse>, callback: sendUnaryData<DiscoverSchemasResponse>) {
        throw new Error('not Implemented');
    }
    discoverSchemasStream(call: ServerWritableStream<DiscoverSchemasRequest, Schema>) {
        throw new Error('not Implemented');
    }
    discoverRelatedEntities(call: ServerUnaryCall<DiscoverRelatedEntitiesRequest, DiscoverRelatedEntitiesResponse>, callback: sendUnaryData<DiscoverRelatedEntitiesResponse>) {
        throw new Error('not Implemented');
    }
    publishStream(call: ServerWritableStream<ReadRequest, Record>) {
        throw new Error('not Implemented');
    }
    configureWrite(call: ServerUnaryCall<ConfigureWriteRequest, ConfigureWriteResponse>, callback: sendUnaryData<ConfigureWriteResponse>) {
        throw new Error('not Implemented');
    }
    configureReplication(call: ServerUnaryCall<ConfigureReplicationRequest, ConfigureReplicationResponse>, callback: sendUnaryData<ConfigureReplicationResponse>) {
        throw new Error('not Implemented');
    }
    prepareWrite(call: ServerUnaryCall<PrepareWriteRequest, PrepareWriteResponse>, callback: sendUnaryData<PrepareWriteResponse>) {
        throw new Error('not Implemented');
    }
    writeStream(call: ServerDuplexStream<Record, RecordAck>) {
        throw new Error('not Implemented');
    }
}
