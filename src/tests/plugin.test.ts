import _, { Dictionary } from 'lodash';
import { describe, expect, test } from '@jest/globals';
import * as fs from 'fs';

import {
    ClientReadableStream,
    Server,
    ServerCredentials,
    credentials,
} from '@grpc/grpc-js';

import {
    PublisherService
} from '../proto/publisher_grpc_pb';

import { Plugin } from '../plugin/plugin'
import { PublisherClient } from '../proto/publisher_grpc_pb';
import {
    ConfigureRequest,
    ConnectRequest,
    ConnectResponse,
    DataVersions,
    DisconnectRequest,
    DisconnectResponse,
    DiscoverSchemasRequest,
    DiscoverSchemasResponse,
    LogLevel,
    OAuthConfiguration,
    PropertyType,
    ReadRequest,
    Record,
    Schema
} from '../proto/publisher_pb';
import { InputSchemaProperty, Settings } from '../helper/settings';
import { GetManifestSchemaJson, GetManifestUIJson } from '../api/read/manifest-schema-json';
import { RealTimeSettings } from '../api/read/real-time-types';
import { endpointPromise } from '../util/publisher-promises';
import sleep from '../util/sleep';
import moment from 'moment';
import { readHttpResponse, sendHttpRequest } from '../util/http-request';
import * as constants from '../constants';
import { checkPortStatus } from 'portscanner';
import path from 'path';

let globalPort = -1;
let globalServer: Server;
let globalServerRunning: boolean = false;

const pluginConnectionId = 'plugin-external-test';

function startServerIfNotRunning() {
    if (!globalServerRunning) {
        // Start server
        const server = new Server();

        let ready = new Promise(resolve => {
            server.bindAsync(`0.0.0.0:${0}`, ServerCredentials.createInsecure(), (__, port) => {
                server.addService(PublisherService, new Plugin());
                server.start();
                globalServerRunning = true;

                globalPort = port;
                console.log(`1|1|tcp|localhost:${port}|grpc`);

                resolve(port);
            });
        });

        globalServer = server;

        return ready;
    }
    else {
        return new Promise(resolve => resolve(globalPort));
    }
}

function getGrpcClient() {
    let client = new PublisherClient(`localhost:${globalPort}`, credentials.createInsecure());
    return client;
}

function getDefaultSchemaProperties(): InputSchemaProperty[] {
    return [
        { propertyName: 'id', propertyType: 'String' },
        { propertyName: 'name', propertyType: 'String' },
        { propertyName: 'signed', propertyType: 'Boolean' },
        { propertyName: 'json', propertyType: 'JSON' },
        { propertyName: 'myInt', propertyType: 'Integer' },
        { propertyName: 'myFloat', propertyType: 'Float' },
        { propertyName: 'updatedAt', propertyType: 'Date Time' },
    ];
}

function getConnectRequest(port?: number, inputSchema?: InputSchemaProperty[]) {
    port ??= 50001;
    let settings: Settings = {
        connectionId: pluginConnectionId,
        port,
        tokenValidationEndpoint: '',
        inputSchema: inputSchema ?? getDefaultSchemaProperties()
    };

    let connectRequest = new ConnectRequest();
    connectRequest.setSettingsJson(JSON.stringify(settings));
    connectRequest.setOauthConfiguration(new OAuthConfiguration());
    connectRequest.setOauthStateJson('');

    return connectRequest;
}

function getDiscoverSchemasRequest() {
    let discoverSchemasRequest = new DiscoverSchemasRequest()
        .setMode(DiscoverSchemasRequest.Mode.ALL)
        .setSampleSize(1);

    return discoverSchemasRequest;
}

function getConfigureRequest() {
    return new ConfigureRequest()
        .setTemporaryDirectory('agent-directories/Temp')
        .setPermanentDirectory('agent-directories/Perm')
        .setLogDirectory('agent-directories/Logs')
        .setDataVersions(new DataVersions())
        .setLogLevel(LogLevel.DEBUG);
}

function getReadRequest(schema: Schema, channelName: string, isRealTime: boolean = true) {
    let realTimeSettings = new RealTimeSettings();
    realTimeSettings.channelName = channelName;

    return new ReadRequest()
        .setSchema(schema)
        .setDataVersions(new DataVersions()
            .setJobId('test')
            .setJobDataVersion(1)
        )
        .setJobId('test')
        .setRealTimeStateJson('')
        .setRealTimeSettingsJson(isRealTime ? realTimeSettings.toString() : '');
}

// ********************
// ***  UNIT TESTS  ***
// ********************

beforeAll(/* SETUP */ async () => await startServerIfNotRunning());
afterAll(/* CLEANUP */ () => globalServer.forceShutdown());

beforeEach(async () => await sleep(2000));

describe('config schema module', () => {
    // SETUP
    const expectedSchemaObject = {
        "type": "object",
        "properties": {
            "connectionId": {
                "type": "string",
                "title": "Connection ID",
                "description": "A unique identifier for this connection"
            },
            "port": {
                "type": "integer",
                "title": "Port"
            },
            "tokenValidationEndpoint": {
                "type": "string",
                "title": "Token Validation Endpoint"
            },
            "inputSchema": {
                "type": "array",
                "title": "Input Schema",
                "items": {
                    "type": "object",
                    "properties": {
                        "propertyName": {
                            "type": "string",
                            "title": "Property Name"
                        },
                        "propertyType": {
                            "type": "string",
                            "title": "Property Type",
                            "enum": [
                                "String",
                                "Integer",
                                "Float",
                                "Boolean",
                                "Date Time",
                                "JSON"
                            ]
                        }
                    }
                }
            }
        },
        "required": [
            "connectionId",
            "port",
            "inputSchema"
        ]
    };

    const expectedUIObject = {
        'ui:order': [
            'connectionId',
            'port',
            'tokenValidationEndpoint',
            'inputSchema'
        ]
    };

    test('getSchemaJson', () => (async () => {
        // ACT
        let schemaJson = await GetManifestSchemaJson();
        let actual = JSON.stringify(JSON.parse(schemaJson));
        let expected = JSON.stringify(expectedSchemaObject);

        // ASSERT
        expect(actual).toBe(expected);
    })());

    test('getUIJson', () => (async () => {
        // ACT
        let schemaJson = await GetManifestUIJson();
        let actual = JSON.stringify(JSON.parse(schemaJson));
        let expected = JSON.stringify(expectedUIObject);

        // ASSERT
        expect(actual).toBe(expected);
    })());
});

describe('plugin module', () => {
    test('connect', async () => {
        // SETUP
        let client = getGrpcClient();

        // 1. Connect
        //   - ACT
        let connectRequest = getConnectRequest();
        let connectResponse = await endpointPromise<ConnectRequest, ConnectResponse>(
            client, client.connect, connectRequest
        );
        //   - ASSERT
        expect(connectResponse).toBeTruthy();

        // 2. Disconnect
        //   - ACT/CLEANUP
        let disconnectResponse = await endpointPromise<DisconnectRequest, DisconnectResponse>(
            client, client.disconnect, new DisconnectRequest()
        );
        //   - ASSERT
        expect(disconnectResponse).toBeTruthy();
    }, 5000);

    test('configure', async () => {
        // SETUP
        let client = getGrpcClient();

        // ACT
        let configureRequest = getConfigureRequest();
        await endpointPromise(client, client.configure, configureRequest).then(() => sleep(500));

        // === PATHS ===
        // __dirname:   /home/ubuntu/Projects/naveego/plugin-external-push/build/src/tests
        // target:      /home/ubuntu/Projects/naveego/plugin-external-push

        // ASSERT
        const pathExists = (folderName: string) => fs.existsSync(
            path.join(__dirname, '..', '..', '..', folderName)
        );
        expect(pathExists('agent-directories/Logs')).toBe(true);
        expect(pathExists('agent-directories/Perm')).toBe(true);
        expect(pathExists('agent-directories/Temp')).toBe(true);
    }, 5000);

    test('discover all', async () => {
        // SETUP
        let client = getGrpcClient();

        let configureRequest = getConfigureRequest();
        await endpointPromise(client, client.configure, configureRequest);

        let connectRequest = getConnectRequest();
        await endpointPromise(client, client.connect, connectRequest);

        // ACT
        let discoverRequest = getDiscoverSchemasRequest();
        let discoverResponse = await endpointPromise<
            DiscoverSchemasRequest,
            DiscoverSchemasResponse
        >(client, client.discoverSchemas, discoverRequest);

        // ASSERT
        expect(discoverResponse).toBeTruthy();

        let schemasList = discoverResponse.getSchemasList();
        expect(schemasList.length).toBe(1);

        let schema = schemasList[0];
        expect(schema.getId()).toBe('external-push-schema');
        expect(schema.getName()).toBe('External Push Schema');
        expect(schema.getDescription()).toBe('');
        expect(schema.getDataFlowDirection()).toBe(Schema.DataFlowDirection.READ);

        let properties = schema.getPropertiesList().map(p => p.toObject());
        expect(properties.length).toBe(7);
        properties.forEach(p => {
            expect(p.description).toBe('');
            expect(p.isKey).toBe(false);
            expect(p.isNullable).toBe(true);
        });

        let property1 = properties[0];
        expect(property1.id).toBe('id');
        expect(property1.name).toBe('id');
        expect(property1.type).toBe(PropertyType.STRING);
        expect(property1.typeAtSource).toBe('String');

        let property2 = properties[1];
        expect(property2.id).toBe('name');
        expect(property2.name).toBe('name');
        expect(property2.type).toBe(PropertyType.STRING);
        expect(property2.typeAtSource).toBe('String');

        let property3 = properties[2];
        expect(property3.id).toBe('signed');
        expect(property3.name).toBe('signed');
        expect(property3.type).toBe(PropertyType.BOOL);
        expect(property3.typeAtSource).toBe('Boolean');

        let property4 = properties[3];
        expect(property4.id).toBe('json');
        expect(property4.name).toBe('json');
        expect(property4.type).toBe(PropertyType.JSON);
        expect(property4.typeAtSource).toBe('JSON');

        let property5 = properties[4];
        expect(property5.id).toBe('myInt');
        expect(property5.name).toBe('myInt');
        expect(property5.type).toBe(PropertyType.INTEGER);
        expect(property5.typeAtSource).toBe('Integer');

        let property6 = properties[5];
        expect(property6.id).toBe('myFloat');
        expect(property6.name).toBe('myFloat');
        expect(property6.type).toBe(PropertyType.FLOAT);
        expect(property6.typeAtSource).toBe('Float');

        let property7 = properties[6];
        expect(property7.id).toBe('updatedAt');
        expect(property7.name).toBe('updatedAt');
        expect(property7.type).toBe(PropertyType.DATETIME);
        expect(property7.typeAtSource).toBe('Date Time');

        // CLEANUP
        await endpointPromise(client, client.disconnect, new DisconnectRequest());
    }, 5000);

    type MockRecordData = {
        id: string;
        name: string | null;
        signed: boolean | null;
        json: object | null;
        myInt: number | null;
        myFloat: number | null;
        updatedAt: Date | null;
    };

    type MockRecordDataOutput = {
        [K in keyof MockRecordData]: MockRecordData[K] extends object
            ? string
            : MockRecordData[K];
    };

    type PropValidator = (value: any) => boolean;
    type MockRecordDataOutputValidator = {
        [K in keyof MockRecordDataOutput]: PropValidator;
    };

    const optionalProp = (validator: PropValidator) => (value: any) => value === null || validator(value);
    const mockRecordDataOutputProps: MockRecordDataOutputValidator = {
        id: v => _.isString(v),
        name: optionalProp(v => _.isString(v)),
        signed: optionalProp(v => _.isBoolean(v)),
        json: optionalProp(v => _.isPlainObject(v)),
        myInt: optionalProp(v => _.isSafeInteger(v)),
        myFloat: optionalProp(v => _.isNumber(v)),
        updatedAt: optionalProp(v => _.isString(v))
    };

    // use type guards instead of blind type casts
    const expectMockRecordDataOutput = (target: any): target is MockRecordDataOutput => {
        let key: keyof MockRecordDataOutputValidator;
        for (key in mockRecordDataOutputProps) {
            const isValid = mockRecordDataOutputProps[key];
            const propValue = target?.[key];
            if (!isValid(propValue)) {
                throw new Error(`Invalid property at key \"${key}\", value: ${
                    _.isString(propValue) ? `\"${propValue}\"` : propValue
                }`);
            }
        }

        const keys = _.keys(target);
        expect(keys.length).toBe(7);

        return true;
    };

    test('read stream real time - get plugin info', async () => {
        // SETUP
        let client = getGrpcClient();

        let connectRequest = getConnectRequest();
        await endpointPromise(client, client.connect, connectRequest);

        let settings: Settings = JSON.parse(connectRequest.getSettingsJson());

        let discoverRequest = getDiscoverSchemasRequest();
        let discoverResponse = await endpointPromise<
            DiscoverSchemasRequest,
            DiscoverSchemasResponse
        >(client, client.discoverSchemas, discoverRequest);

        let responseStream: ClientReadableStream<Record>;
        let schema = discoverResponse.getSchemasList()[0];

        let readRequest = getReadRequest(schema, 'getInfo');

        try {
            responseStream = client.readStream(readRequest);
        }
        catch (err) {
            console.error('Error in read stream: ', err);
            throw err;
        }

        // ACT
        let statusCode = -1;
        let actualConnectionId = '';

        responseStream.on('error', (err: Error) => {
            if (!err.message.includes('CANCELLED: Call cancelled')) {
                console.log(err);
            }
        });

        const timeStart = Date.now();
        const getTask = async () => {
            const status = await checkPortStatus(settings.port);
            expect(status).toBe('open');

            // post 1 record
            const response = await sendHttpRequest({
                ...constants.requestOptions.GetPluginInfo,
                timeout: 1000
            });
            statusCode = response.statusCode ?? -1;

            const body = await readHttpResponse(response);
            if (_.isString(body)) {
                actualConnectionId = body.slice(6);
            }
        };

        // wait for records to come in
        await sleep(2000).then(getTask);

        const timeEnd = Date.now();
        const durationSeconds = Math.round((timeEnd - timeStart) / 10) / 100;
        console.log(`Waited ${durationSeconds} second${(durationSeconds === 1) ? '' : 's'} for read stream to finish`);

        // ASSERT
        expect(statusCode).toBe(200);
        expect(actualConnectionId).toBe(pluginConnectionId);

        // CLEANUP
        responseStream.destroy();
        await sleep(2000);

        try {
            await endpointPromise(client, client.disconnect, new DisconnectRequest());
        }
        catch (err) {
            console.warn(`Error when attempting to disconnect:\n${err}`);
        }
    }, 180 * 1000);

    test('read stream real time - post 1 record', async () => {
        // SETUP
        const expectedRecord: MockRecordData = {
            id: 'test-record-1',
            name: 'myRecord-1',
            signed: true,
            json: { myData1: 1, myDataStr: 'some-text' },
            myInt: 1,
            myFloat: 1.00,
            updatedAt: new Date()
        };

        let client = getGrpcClient();

        let connectRequest = getConnectRequest();
        await endpointPromise(client, client.connect, connectRequest);

        let discoverRequest = getDiscoverSchemasRequest();
        let discoverResponse = await endpointPromise<
            DiscoverSchemasRequest,
            DiscoverSchemasResponse
        >(client, client.discoverSchemas, discoverRequest);

        let responseStream: ClientReadableStream<Record>;
        let schema = discoverResponse.getSchemasList()[0];

        let readRequest = getReadRequest(schema, 'post1');

        try {
            responseStream = client.readStream(readRequest);
        }
        catch (err) {
            console.error('Error in read stream: ', err);
            throw err;
        }

        // ACT
        let statusCode = -1;
        let actualRecordsCount = 0;
        const actualRecords: Record[] = [];

        responseStream.on('data', (chunk) => {
            actualRecordsCount += 1;
            actualRecords.push(chunk);
            expect(chunk).toBeTruthy();
        });

        responseStream.on('error', (err: Error) => {
            if (!err.message.includes('CANCELLED: Call cancelled')) {
                console.log(err);
            }
        });

        const timeStart = Date.now();
        const postTask = async () => {
            // post 1 record
            const response = await sendHttpRequest(
                {
                    ...constants.requestOptions.PostRecord,
                    timeout: 1000
                },
                JSON.stringify(expectedRecord)
            );

            statusCode = response.statusCode ?? -1;
        };

        // wait for records to come in
        await sleep(2000).then(postTask).then(() => sleep(500));

        const timeEnd = Date.now();
        const durationSeconds = Math.round((timeEnd - timeStart) / 10) / 100;
        console.log(`Waited ${durationSeconds} second${(durationSeconds === 1) ? '' : 's'} for read stream to finish`);

        // ASSERT
        expect(statusCode).toBe(200);
        expect(actualRecordsCount).toBe(1);

        const actualRecord = actualRecords?.[0];
        expect(actualRecord).toBeTruthy();

        const action = actualRecord.getAction();
        expect(action).toBe(Record.Action.UPSERT);

        let data = JSON.parse(actualRecord.getDataJson());
        if (expectMockRecordDataOutput(data)) { // else, error
            console.log(`Record Data JSON: ${JSON.stringify(data, null, 2)}`);
            expect(data.id).toBe(expectedRecord.id);
            expect(data.name).toBe(expectedRecord.name);
            expect(data.signed).toBe(expectedRecord.signed);
            expect(data.json).toStrictEqual(expectedRecord.json);
            expect(data.myInt).toBe(expectedRecord.myInt);
            expect(data.myFloat).toBe(expectedRecord.myFloat);
            expect(data.updatedAt).toBe(moment(expectedRecord.updatedAt).utc().toISOString());
        }

        // CLEANUP
        responseStream.destroy();
        await sleep(2000);

        try {
            await endpointPromise(client, client.disconnect, new DisconnectRequest());
        }
        catch (err) {
            console.warn(`Error when attempting to disconnect:\n${err}`);
        }
    }, 15 * 1000);

    test('read stream real time - post 5 records', async () => {
        // SETUP
        const expectedRecords: MockRecordData[] = [
            {
                id: 'test-record-001',
                name: 'Joe Sanderson',
                signed: false,
            },
            {
                id: 'test-record-002',
                name: 'Aunt Slappy',
                signed: true,
            },
            {
                id: 'test-record-003',
                name: 'Indiana Jones',
                signed: true,
            },
            {
                id: 'test-record-004',
                name: 'Luke Skywalker',
                signed: true,
            },
            {
                id: 'test-record-005',
                name: 'Uncle Sam',
                signed: false,
            },
        ].map((partial): MockRecordData => ({
            json: null, myInt: null,
            myFloat: null, updatedAt: null,
            ...partial
        }));

        const expectedRecordsMap: Dictionary<MockRecordData> = {};
        expectedRecords.forEach(r => {
            expectedRecordsMap[r.id] = r;
        });

        let client = getGrpcClient();

        let connectRequest = getConnectRequest();
        await endpointPromise(client, client.connect, connectRequest);

        let discoverRequest = getDiscoverSchemasRequest();
        let discoverResponse = await endpointPromise<
            DiscoverSchemasRequest,
            DiscoverSchemasResponse
        >(client, client.discoverSchemas, discoverRequest);

        let responseStream: ClientReadableStream<Record>;
        let schema = discoverResponse.getSchemasList()?.[0];

        let readRequest = getReadRequest(schema, 'post5');

        try {
            responseStream = client.readStream(readRequest);
        }
        catch (err) {
            console.error('Error in read stream: ', err);
            throw err;
        }

        // ACT
        let actualRecordsCount = 0;
        let actualRecords: Record[] = [];

        responseStream.on('data', (chunk) => {
            actualRecordsCount += 1;
            actualRecords.push(chunk);
            console.log(`Received 1 record, at ${actualRecordsCount}`);
        });

        responseStream.on('error', (err: Error) => {
            if (!err.message.includes('CANCELLED: Call cancelled')) {
                console.log(err);
            }
        });

        let timeStart = Date.now();
        let postTask = async (data: MockRecordData) => {
            // post 1 record
            const response = await sendHttpRequest(
                constants.requestOptions.PostRecord,
                JSON.stringify(data)
            );

            expect(response.statusCode).toBe(200);
        };

        // wait for records to come in
        await sleep(5000);

        for (let i = 0; i < expectedRecords.length; i++) {
            const record = expectedRecords[i];
            postTask(record);
            await sleep(500);
        }

        let timeEnd = Date.now();
        let durationSeconds = Math.round((timeEnd - timeStart) / 10) / 100;
        console.log(`Waited ${durationSeconds} second${(durationSeconds === 1) ? '' : 's'} for read stream to finish`);

        // ASSERT
        expect(actualRecordsCount).toBe(expectedRecords.length);

        const actualRecordIds: string[] = [];
        for (let i = 0; i < actualRecords.length; i++) {
            const actualRecord = actualRecords[i];
            expect(actualRecord).toBeTruthy();

            const action = actualRecord.getAction();
            expect(action).toBe(Record.Action.UPSERT);

            let data = JSON.parse(actualRecord.getDataJson());
            if (expectMockRecordDataOutput(data)) { // else, error
                console.log(`Record Data JSON: ${JSON.stringify(data, null, 2)}`);
                const expectedRecord = expectedRecordsMap[data.id];
                expect(expectedRecord).toBeTruthy();

                expect(data.id).toStrictEqual(expectedRecord.id);
                expect(data.name).toBe(expectedRecord.name);
                expect(data.signed).toBe(expectedRecord.signed);

                if (!actualRecordIds.includes(data.id)) {
                    actualRecordIds.push(data.id);
                }
            }
        }

        expect(actualRecordIds.length).toBe(expectedRecords.length);

        // CLEANUP
        responseStream.destroy();
        await sleep(2000);

        try {
            await endpointPromise(client, client.disconnect, new DisconnectRequest());
        }
        catch (err) {
            console.warn(`Error when attempting to disconnect:\n${err}`);
        }
    }, 15 * 1000);

    test('read stream real time - delete 3 records', async () => {
        // SETUP
        const expectedRecords: MockRecordData[] = [
            {
                id: 'test-record-002',
                name: 'Aunt Slappy',
                signed: true,
                json: { myValues: [ true, false, 1, 2, 3 ] },
            },
            {
                id: 'test-record-004',
                name: 'Luke Skywalker',
                signed: true,
                myInt: 5,
            },
            {
                id: 'test-record-005',
                name: 'Uncle Sam',
                signed: false,
                updatedAt: new Date()
            },
        ].map((partial): MockRecordData => ({
            json: null, myInt: null,
            myFloat: null, updatedAt: null,
            ...partial
        }));;

        const expectedRecordsMap: Dictionary<MockRecordData> = {};
        expectedRecords.forEach(r => {
            expectedRecordsMap[r.id] = r;
        });

        let client = getGrpcClient();

        let connectRequest = getConnectRequest();
        await endpointPromise(client, client.connect, connectRequest);

        let discoverRequest = getDiscoverSchemasRequest();
        let discoverResponse = await endpointPromise<
            DiscoverSchemasRequest,
            DiscoverSchemasResponse
        >(client, client.discoverSchemas, discoverRequest);

        let responseStream: ClientReadableStream<Record>;
        let schema = discoverResponse.getSchemasList()?.[0];

        let readRequest = getReadRequest(schema, 'delete3');

        try {
            responseStream = client.readStream(readRequest);
        }
        catch (err) {
            console.error('Error in read stream: ', err);
            throw err;
        }

        // ACT
        let actualRecordsCount = 0;
        let actualRecords: Record[] = [];

        responseStream.on('data', (chunk) => {
            actualRecordsCount += 1;
            actualRecords.push(chunk);
            console.log(`Received 1 record, at ${actualRecordsCount}`);
        });

        responseStream.on('error', (err: Error) => {
            if (!err.message.includes('CANCELLED: Call cancelled')) {
                console.log(err);
            }
        });

        let timeStart = Date.now();
        let deleteTask = async (data: MockRecordData) => {
            // delete 1 record
            const response = await sendHttpRequest(
                constants.requestOptions.DeleteRecord,
                JSON.stringify(data)
            );

            expect(response.statusCode).toBe(200);
        };

        // wait for records to come in
        await sleep(5000);

        for (let i = 0; i < expectedRecords.length; i++) {
            const record = expectedRecords[i];
            deleteTask(record);
            await sleep(500);
        }

        let timeEnd = Date.now();
        let durationSeconds = Math.round((timeEnd - timeStart) / 10) / 100;
        console.log(`Waited ${durationSeconds} second${(durationSeconds === 1) ? '' : 's'} for read stream to finish`);

        // ASSERT
        expect(actualRecordsCount).toBe(expectedRecords.length);

        const actualRecordIds: string[] = [];
        for (let i = 0; i < actualRecords.length; i++) {
            const actualRecord = actualRecords[i];
            expect(actualRecord).toBeTruthy();

            const action = actualRecord.getAction();
            expect(action).toBe(Record.Action.DELETE);

            let data = JSON.parse(actualRecord.getDataJson());
            if (expectMockRecordDataOutput(data)) { // else, error
                console.log(`Record Data JSON: ${JSON.stringify(data, null, 2)}`);
                const expectedRecord = expectedRecordsMap[data.id];
                expect(expectedRecord).toBeTruthy();

                expect(data.id).toBe(expectedRecord.id);
                expect(data.name).toBe(expectedRecord.name);
                expect(data.signed).toBe(expectedRecord.signed);

                expect(data.json).toStrictEqual(
                    !!data.json ? expectedRecord.json : null
                );
                expect(data.myInt).toBe(
                    !!data.myInt ? expectedRecord.myInt : null
                );
                expect(data.myFloat).toBe(
                    !!data.myFloat ? expectedRecord.myFloat : null
                );
                expect(data.updatedAt).toBe(
                    !!data.updatedAt ? moment(expectedRecord.updatedAt).utc().toISOString() : null
                );

                if (!actualRecordIds.includes(data.id)) {
                    actualRecordIds.push(data.id);
                }
            }
        }

        expect(actualRecordIds.length).toBe(expectedRecords.length);

        // CLEANUP
        responseStream.destroy();
        await sleep(2000);

        try {
            await endpointPromise(client, client.disconnect, new DisconnectRequest());
        }
        catch (err) {
            console.warn(`Error when attempting to disconnect:\n${err}`);
        }
    }, 15 * 1000);

    test('read stream real time - reconnect', async () => {
        try {
            // SETUP
            var client: PublisherClient | undefined = undefined;
            client = getGrpcClient();

            let connectRequest = getConnectRequest();
            await endpointPromise(client, client.connect, connectRequest);

            let discoverRequest = getDiscoverSchemasRequest();
            let discoverResponse = await endpointPromise<
                DiscoverSchemasRequest,
                DiscoverSchemasResponse
            >(client, client.discoverSchemas, discoverRequest);

            var responseStream: ClientReadableStream<Record> | undefined = undefined;
            let schema = discoverResponse.getSchemasList()[0];

            let readRequest = getReadRequest(schema, 'read-reconnect');

            try {
                responseStream = client.readStream(readRequest);
            }
            catch (err) {
                console.error('Error in read stream: ', err);
                throw err;
            }

            // ACT
            responseStream.on('error', (err: Error) => {
                if (!err.message.includes('CANCELLED: Call cancelled')) {
                    console.log(err);
                }
            });

            const timeStart = Date.now();

            // wait for records to come in
            const samePortResult = await Promise.race([
                sleep(500),
                endpointPromise<ConnectRequest, ConnectResponse>(client, client.connect, connectRequest)
            ]);

            await sleep(500);

            let connectRequest2 = getConnectRequest(50005);
            const otherPortResult = await Promise.race([
                sleep(2000),
                endpointPromise<ConnectRequest, ConnectResponse>(client, client.connect, connectRequest2)
            ]);

            const timeEnd = Date.now();
            const durationSeconds = Math.round((timeEnd - timeStart) / 10) / 100;
            console.log(`Waited ${durationSeconds} second${(durationSeconds === 1) ? '' : 's'} for reconnect finish`);

            // ASSERT
            if (!_.isObject(samePortResult)) throw new Error('Reconnect 1 timed out');
            if (!_.isObject(otherPortResult)) throw new Error('Reconnect 2 timed out');

            expect(samePortResult).toBeTruthy();
            expect(otherPortResult).toBeTruthy();
        }
        finally {
            // CLEANUP
            if (!!responseStream) {
                responseStream.destroy();
                await sleep(2000);
            }

            if (!!client) {
                try {
                    await endpointPromise(client, client.disconnect, new DisconnectRequest());
                }
                catch (err) {
                    console.warn(`Error when attempting to disconnect:\n${err}`);
                }
            }
        }
    }, 15 * 1000);
});