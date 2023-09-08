import _, { Dictionary } from 'lodash';
import { describe, expect, test } from '@jest/globals';
import http from 'http';

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
import { GetSchemaJson, GetUIJson } from '../api/read/get-schema-json';
import path from 'path';
import { RealTimeSettings, RealTimeState } from '../api/read/real-time-types';
import { endpointPromise } from '../util/publisher-promises';
import sleep from '../util/sleep';

let globalPort = -1;
let globalServer: Server;
let globalServerRunning: boolean = false;

function startServerIfNotRunning() {
    if (!globalServerRunning) {
        // Start server
        const server = new Server();

        let ready = new Promise(resolve => {
            server.bindAsync(`0.0.0.0:${0}`, ServerCredentials.createInsecure(), (err, port) => {
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
    ];
}

function getConnectRequest(inputSchema?: InputSchemaProperty[]) {
    let settings: Settings = {
        port: 50001,
        tokenValidationEndpoint: '',
        inputSchema: inputSchema ?? getDefaultSchemaProperties()
    };

    let connectRequest = new ConnectRequest();
    connectRequest.setSettingsJson(JSON.stringify(settings));
    connectRequest.setOauthConfiguration(new OAuthConfiguration());
    connectRequest.setOauthStateJson("");

    return connectRequest;
}

function getDiscoverSchemasRequest() {
    let discoverSchemasRequest = new DiscoverSchemasRequest()
        .setMode(DiscoverSchemasRequest.Mode.ALL)
        .setSampleSize(1);

    return discoverSchemasRequest;
}

function getConfigureRequest() {
    let makePath = (folderName: string) => path.join('..', '..', '..', folderName);
    return new ConfigureRequest()
        .setTemporaryDirectory(makePath('Temp'))
        .setPermanentDirectory(makePath('Perm'))
        .setLogDirectory(makePath('Logs'))
        .setDataVersions(new DataVersions())
        .setLogLevel(LogLevel.DEBUG);
}

function getReadRequest(schema: Schema) {
    return new ReadRequest()
        .setSchema(schema)
        .setDataVersions(new DataVersions()
            .setJobId('test')
            .setJobDataVersion(1)
        )
        .setJobId('test')
        .setRealTimeStateJson(new RealTimeState().toString())
        .setRealTimeSettingsJson(new RealTimeSettings().toString());
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
            "port",
            "inputSchema"
        ]
    };

    const expectedUIObject = {
        "ui:order": [
          "port",
          "tokenValidationEndpoint",
          "inputSchema"
        ]
    };

    test('getSchemaJson', () => (async () => {
        // ACT
        let schemaJson = await GetSchemaJson();
        let actual = JSON.stringify(JSON.parse(schemaJson));
        let expected = JSON.stringify(expectedSchemaObject);

        // ASSERT
        expect(actual).toBe(expected);
    })());

    test('getUIJson', () => (async () => {
        // ACT
        let schemaJson = await GetUIJson();
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
    }, 20000);

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
        expect(properties.length).toBe(3);
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

        // CLEANUP
        await endpointPromise(client, client.disconnect, new DisconnectRequest());
    });

    type MockRecordData = {
        id: string;
        name: string;
        signed: boolean;
    };

    // use type guards instead of blind type casts
    const isMockRecordData = (target: any): target is MockRecordData => {
        if (!_.isString(target['id'])) return false;
        if (!_.isString(target['name'])) return false;
        if (!_.isBoolean(target['signed'])) return false;

        const keys = _.keys(target);
        if (keys.length !== 3) return false;

        return true;
    };

    const expectMockRecordData = (target: any): target is MockRecordData => {
        const isMatch = isMockRecordData(target);
        expect(isMatch).toBe(true);
        return isMatch;
    };

    test('read stream real time - post 1 record', async () => {
        // SETUP
        const expectedRecord: MockRecordData = {
            id: 'test-record-1',
            name: 'myRecord-1',
            signed: true,
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

        let readRequest = getReadRequest(schema);

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
            const requestBody = JSON.stringify(expectedRecord);

            const request = http.request(
                {
                    hostname: 'localhost',
                    port: 50001,
                    path: '/externalpush',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(requestBody),
                    },
                    timeout: 15000
                },
                res => {
                    console.log(`Received Status: ${res.statusCode}`);
                    res.setEncoding('utf8');

                    if (!!res.statusCode) {
                        statusCode = res.statusCode;
                    }
                }
            );

            request.write(requestBody);
            request.end();
            
            for (let i = 0; i < 15 && statusCode < 0; i++) {
                await sleep(1000);
            }
        };

        // wait for records to come in
        await sleep(5000).then(postTask);

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
        if (expectMockRecordData(data)) { // else, error
            console.log(`Record Data JSON: ${JSON.stringify(data, null, 2)}`);
            expect(data.id).toBe(expectedRecord.id);
            expect(data.name).toBe(expectedRecord.name);
            expect(data.signed).toBe(expectedRecord.signed);
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
    }, 20 * 1000);

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
        ];

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

        let readRequest = getReadRequest(schema);

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
            const requestBody = JSON.stringify(data);

            let statusCode = -1;
            const request = http.request(
                {
                    hostname: 'localhost',
                    port: 50001,
                    path: '/externalpush',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(requestBody),
                    },
                    timeout: 15000
                },
                res => {
                    console.log(`Received Status: ${res.statusCode}`);
                    res.setEncoding('utf8');

                    if (!!res.statusCode) {
                        statusCode = res.statusCode;
                    }
                }
            );

            request.write(requestBody);
            request.end();
            
            for (let i = 0; i < 15 && statusCode < 0; i++) {
                await sleep(1000);
            }

            if (statusCode !== 200) throw new Error(`Expected status code 200; received code ${statusCode}`);
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
            if (expectMockRecordData(data)) { // else, error
                console.log(`Record Data JSON: ${JSON.stringify(data, null, 2)}`);
                const expectedRecord = expectedRecordsMap[data.id];
                expect(expectedRecord).toBeTruthy();

                expect(data.id).toBe(expectedRecord.id);
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
    }, 30 * 1000);

    test('read stream real time - delete 3 records', async () => {
        // SETUP
        const expectedRecords: MockRecordData[] = [
            {
                id: 'test-record-002',
                name: 'Aunt Slappy',
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
        ];

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

        let readRequest = getReadRequest(schema);

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
            const requestBody = JSON.stringify(data);

            let statusCode = -1;
            const request = http.request(
                {
                    hostname: 'localhost',
                    port: 50001,
                    path: '/externalpush',
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(requestBody),
                    },
                    timeout: 15000
                },
                res => {
                    console.log(`Received Status: ${res.statusCode}`);
                    res.setEncoding('utf8');

                    if (!!res.statusCode) {
                        statusCode = res.statusCode;
                    }
                }
            );

            request.write(requestBody);
            request.end();
            
            for (let i = 0; i < 15 && statusCode < 0; i++) {
                await sleep(1000);
            }

            if (statusCode !== 200) throw new Error(`Expected status code 200; received code ${statusCode}`);
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
            if (expectMockRecordData(data)) { // else, error
                console.log(`Record Data JSON: ${JSON.stringify(data, null, 2)}`);
                const expectedRecord = expectedRecordsMap[data.id];
                expect(expectedRecord).toBeTruthy();

                expect(data.id).toBe(expectedRecord.id);
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
    }, 30 * 1000);
});