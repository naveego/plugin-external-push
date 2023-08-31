import _ from 'lodash';
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

const waitForTimeout = true;

beforeAll(async () => await startServerIfNotRunning());
afterAll(() => globalServer.forceShutdown());

// async function executeReadStreamTest<T>(args: {
//     initializeState: () => T;
//     addResponseStreamHandlers: (
//         state: T,
//         updateState: (state: T) => void,
//         responseStream: ClientReadableStream<Record>
//     ) => Promise<void>;
//     sendRequestsToServer: (state: T, updateState: (state: T) => void) => Promise<void>;
//     callback: (state: T) => Promise<void>;
//     timeoutSeconds?: number;
//     teardownTimeout?: number;
//     waitForTimeout?: boolean;
// }): Promise<void> {
//     let client = getGrpcClient();

//     let connectRequest = getConnectRequest();
//     await endpointPromise(client, client.connect, connectRequest);

//     let discoverRequest = getDiscoverSchemasRequest();
//     let discoverResponse = await endpointPromise<
//         DiscoverSchemasRequest,
//         DiscoverSchemasResponse
//     >(client, client.discoverSchemas, discoverRequest);

//     let responseStream: ClientReadableStream<Record>;
//     let schema = discoverResponse.getSchemasList()?.[0];
//     expect(schema).toBeTruthy();

//     let readRequest = getReadRequest(schema);
//     responseStream = client.readStream(readRequest);
//     expect(responseStream).toBeTruthy();

//     let state = args.initializeState();
//     let updateState = (s: typeof state) => {
//         state = { ...state, ...s };
//     };

//     let timeStart = Date.now();
//     let promises = [
//         args.addResponseStreamHandlers(state, updateState, responseStream)
//             .then(() => sleep(5000))
//             .then(() => args.sendRequestsToServer(state, updateState)),
//         sleep((args.timeoutSeconds ?? 15) * 1000)
//     ];

//     if (args.waitForTimeout) await Promise.all(promises);
//     else await Promise.race(promises);

//     let timeEnd = Date.now();
//     let durationSeconds = Math.round((timeEnd - timeStart) / 10) / 100;
//     console.log(`Waited ${durationSeconds} second${(durationSeconds === 1) ? '' : 's'} for read stream to finish`);

//     if (!responseStream.destroyed) {
//         responseStream.destroy();
//         await sleep(args.teardownTimeout ?? 2500);
//     }

//     await endpointPromise(client, client.disconnect, new DisconnectRequest());
//     await args.callback(state);
// }

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
    // test('connect', async () => {
    //     let client = getGrpcClient();

    //     let connectRequest = getConnectRequest();
    //     let connectResponse = await endpointPromise<ConnectRequest, ConnectResponse>(
    //         client, client.connect, connectRequest
    //     );
    //     expect(connectResponse).toBeTruthy();

    //     let disconnectResponse = await endpointPromise<DisconnectRequest, DisconnectResponse>(
    //         client, client.disconnect, new DisconnectRequest()
    //     );
    //     expect(disconnectResponse).toBeTruthy();
    // }, 20000);

    // test('discover all', async () => {
    //     let client = getGrpcClient();

    //     let configureRequest = getConfigureRequest();
    //     await endpointPromise(client, client.configure, configureRequest);

    //     let connectRequest = getConnectRequest();
    //     await endpointPromise(client, client.connect, connectRequest);

    //     let discoverRequest = getDiscoverSchemasRequest();
    //     let discoverResponse = await endpointPromise<
    //         DiscoverSchemasRequest,
    //         DiscoverSchemasResponse
    //     >(client, client.discoverSchemas, discoverRequest);

    //     expect(discoverResponse).toBeTruthy();

    //     let schemasList = discoverResponse.getSchemasList();
    //     expect(schemasList.length).toBe(1);

    //     let schema = schemasList[0];
    //     expect(schema.getId()).toBe('external-push-schema');
    //     expect(schema.getName()).toBe('External Push Schema');
    //     expect(schema.getDescription()).toBe('');
    //     expect(schema.getDataFlowDirection()).toBe(Schema.DataFlowDirection.READ);

    //     let properties = schema.getPropertiesList().map(p => p.toObject());
    //     expect(properties.length).toBe(3);
    //     properties.forEach(p => {
    //         expect(p.description).toBe('');
    //         expect(p.isKey).toBe(false);
    //         expect(p.isNullable).toBe(true);
    //     });

    //     let property1 = properties[0];
    //     expect(property1.id).toBe('id');
    //     expect(property1.name).toBe('id');
    //     expect(property1.type).toBe(PropertyType.STRING);
    //     expect(property1.typeAtSource).toBe('String');

    //     let property2 = properties[1];
    //     expect(property2.id).toBe('name');
    //     expect(property2.name).toBe('name');
    //     expect(property2.type).toBe(PropertyType.STRING);
    //     expect(property2.typeAtSource).toBe('String');

    //     let property3 = properties[2];
    //     expect(property3.id).toBe('signed');
    //     expect(property3.name).toBe('signed');
    //     expect(property3.type).toBe(PropertyType.BOOL);
    //     expect(property3.typeAtSource).toBe('Boolean');

    //     await endpointPromise(client, client.disconnect, new DisconnectRequest());
    // });

    test('read stream real time - post 1 record', async () => {
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

        let readRequest = getReadRequest(schema);
        responseStream = client.readStream(readRequest);
        expect(responseStream).toBeTruthy();

        responseStream.on('data', (chunk) => {
            console.log('received data: ', chunk);
            recordsCount += 1;
            records.push(chunk);
            expect(chunk).toBeTruthy();
        });

        responseStream.on('error', (err: Error) => {
            console.error(err);
        });

        let recordsCount = 0;
        let records: Record[] = [];

        let timeStart = Date.now();
        let postTask = async () => {
            // post 1 record
            const requestBody = JSON.stringify({
                id: 'test-record-1',
                name: 'myRecord-1',
                signed: true,
            });

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
                    }
                },
                res => {
                    console.log(`STATUS: ${res.statusCode}`);
                    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                    res.setEncoding('utf8');

                    if (!!res.statusCode) {
                        statusCode = res.statusCode;
                    }
                }
            );

            request.write(requestBody);
            request.end();
            
            for (let i = 0; i < 10 && statusCode < 0; i++) {
                await sleep(1000);
            }

            expect(statusCode).toBe(200);
            // expect(response?.status).toBe(200);
            // const data = await response.json();
            // console.log('received response: ', data); 
        };

        // wait for records to come in
        await Promise.all([
            postTask(),
            sleep(10000)
        ]);

        let timeEnd = Date.now();
        let durationSeconds = Math.round((timeEnd - timeStart) / 10) / 100;
        console.log(`Waited ${durationSeconds} second${(durationSeconds === 1) ? '' : 's'} for read stream to finish`);

        try {
            responseStream.destroy();
        }
        finally {
            await endpointPromise(client, client.disconnect, new DisconnectRequest());

            expect(recordsCount).toBe(1);
            expect(records).toHaveLength(1);
        }
    }, 20 * 1000);
});