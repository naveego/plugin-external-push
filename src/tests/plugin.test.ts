import { describe, expect, test } from '@jest/globals';
import fetch from 'node-fetch';

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
    DataVersions,
    DisconnectRequest,
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
import _, { reject } from 'lodash';
import { endpointPromise } from '../util/publisher-promises';

jest.mock('node-fetch', () => jest.fn());

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

function getReadRequest() {
    return new ReadRequest()
        .setDataVersions(new DataVersions()
            .setJobId('test')
            .setJobDataVersion(1)
        )
        .setJobId('test')
        .setRealTimeStateJson(new RealTimeState().toString())
        .setRealTimeSettingsJson(new RealTimeSettings().toString());
}

function sleep(ms: number) {
    return new Promise<void>(r => setTimeout(r, ms));
}

// ********************
// ***  UNIT TESTS  ***
// ********************

beforeAll(async () => await startServerIfNotRunning());
afterAll(() => globalServer.forceShutdown());

async function executeReadStreamTest<T>(args: {
    initializeState: () => T,
    addResponseStreamHandlers: (
        state: T,
        updateState: (state: T) => void,
        responseStream: ClientReadableStream<Record>,
        setDoneReading: () => void
    ) => Promise<void>,
    sendRequestsToServer: (state: T, updateState: (state: T) => void, setDoneReading: () => void) => Promise<void>,
    callback: (state: T) => Promise<void>,
    timeoutSeconds?: number
}): Promise<void> {
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
    expect(schema).toBeTruthy();

    let readRequest = getReadRequest();
    responseStream = client.readStream(readRequest);
    expect(responseStream).toBeTruthy();

    let state = args.initializeState();
    let updateState = (s: typeof state) => {
        state = s;
    };
    let readingRecords = true;
    let resolved = false;
    const setDoneReading = () => readingRecords = false;

    let timeStart = Date.now();
    await Promise.race([
        args.addResponseStreamHandlers(state, updateState, responseStream, setDoneReading)
            .then(
                () => { args.sendRequestsToServer(state, updateState, setDoneReading); resolved = true; },
                () => { setDoneReading(); }
            ),
        sleep((args.timeoutSeconds ?? 10) * 1000)
    ]);

    let timeEnd = Date.now();
    let durationSeconds = Math.round((timeEnd - timeStart) / 10) / 100;
    console.log(`Waited ${durationSeconds} second${(durationSeconds === 1) ? '' : 's'} for read stream to finish`);

    await endpointPromise(client, client.disconnect, new DisconnectRequest());

    expect(resolved).toBe(true);
    await args.callback(state);
}

describe('config schema module', () => {
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
        let schemaJson = await GetSchemaJson();
        expect(schemaJson).toBeTruthy();

        let actual = JSON.stringify(JSON.parse(schemaJson));
        let expected = JSON.stringify(expectedSchemaObject);
        expect(actual).toBe(expected);
    })());

    test('getUIJson', () => (async () => {
        let schemaJson = await GetUIJson();
        expect(schemaJson).toBeTruthy();

        let actual = JSON.stringify(JSON.parse(schemaJson));
        let expected = JSON.stringify(expectedUIObject);
        expect(actual).toBe(expected);
    })());
});

describe('plugin module', () => {
    test('connect', () => (async () => {
        let client = getGrpcClient();

        let connectRequest = getConnectRequest();
        await endpointPromise(client, client.connect, connectRequest);

        await endpointPromise(client, client.disconnect, new DisconnectRequest());
    })());

    test('discover all', () => (async () => {
        let client = getGrpcClient();

        let configureRequest = getConfigureRequest();
        await endpointPromise(client, client.configure, configureRequest);

        let connectRequest = getConnectRequest();
        await endpointPromise(client, client.connect, connectRequest);

        let discoverRequest = getDiscoverSchemasRequest();
        let discoverResponse = await endpointPromise<
            DiscoverSchemasRequest,
            DiscoverSchemasResponse
        >(client, client.discoverSchemas, discoverRequest);

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

        await endpointPromise(client, client.disconnect, new DisconnectRequest());
    })());

    test('read stream real time - empty', () => executeReadStreamTest({
        initializeState: () => {
            let records: Record[] = [];
            let recordsCount: number = 0;
            return { records, recordsCount };
        },
        addResponseStreamHandlers: (state, updateState, responseStream, setDoneReading) => new Promise(resolve => {
            responseStream.on('data', (chunk) => {
                updateState({
                    ...state,
                    recordsCount: state.recordsCount + 1
                });
                expect(chunk).toBeTruthy();
            });
            responseStream.on('end', () => {
                setDoneReading();
            });
            resolve();
        }),
        sendRequestsToServer: () => new Promise(resolve => resolve()),
        callback: (state) => new Promise(resolve => {
            expect(state.recordsCount).toBe(0);
            expect(state.records).toHaveLength(0);
            resolve();
        }),
        timeoutSeconds: 5,
    }), 10 * 1000);

    test('read stream real time - post 1 record', async () => await executeReadStreamTest({
        initializeState: () => {
            let records: Record[] = [];
            let recordsCount: number = 0;
            return { records, recordsCount };
        },
        addResponseStreamHandlers: (state, updateState, responseStream, setDoneReading) => new Promise(
            (resolve, reject) => {
                try {
                    responseStream.on('data', (chunk) => {
                        updateState({
                            ...state,
                            recordsCount: state.recordsCount + 1,
                            records: [ ...state.records, chunk ]
                        });
                        expect(chunk).toBeTruthy();
                    });
                    responseStream.on('close', () => {
                        setDoneReading();
                    });
                    resolve();
                }
                catch (e) {
                    reject();
                }
            }
        ),
        sendRequestsToServer: async () => {
            // post 1 record
            const requestBody = {
                id: 'test-record-1',
                name: 'myRecord-1',
                signed: true,
            };
            const response = await fetch(`http://localhost:${globalPort}/externalpush`, {
                method: 'POST',
                body: JSON.stringify(requestBody),
            });
            expect(response).toBeTruthy();
            expect(response?.status).toBe(200);
            const data = await response.json();
            console.log('received response: ', data);
        },
        callback: (state) => new Promise((resolve, reject) => {
            try {
                expect(state.recordsCount).toBe(1);
                expect(state.records).toHaveLength(1);
                resolve();
            }
            catch (e) {
                reject(e);
            }
        }),
        timeoutSeconds: 8,
    }), 2000 * 1000);
});