import {describe, expect, test, } from '@jest/globals';

import {
    Server,
    ServerCredentials,
    credentials,
} from '@grpc/grpc-js';

import {
    PublisherService
} from '../proto/publisher_grpc_pb';

import { Plugin} from '../plugin/plugin'
import { PublisherClient } from '../proto/publisher_grpc_pb';
import { ConfigurationFormRequest, ConfigureRealTimeRequest, ConfigureRequest, ConnectRequest, DataVersions, DisconnectRequest, DiscoverSchemasRequest, LogLevel, OAuthConfiguration, Property, PropertyType, ReadRequest, Schema } from '../proto/publisher_pb';
import { InputSchemaProperty, Settings } from '../helper/settings';
import { GetSchemaJson, GetUIJson } from '../api/read/get-schema-json';
import { GetType } from '../api/discover/get-all-schemas';
import path from 'path';
import { RealTimeSettings, RealTimeState } from '../api/read/real-time-types';

let globalPort = -1;
let globalServer: Server;
let globalServerRunning: boolean = false;

function startServerIfNotRunning() {
    if (!globalServerRunning) {
        // Start server
        const server = new Server();

        let ready = new Promise((resolve, reject) => {
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
        return new Promise((resolve, reject) => { resolve(globalPort); });
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

// ********************
// ***  UNIT TESTS  ***
// ********************

beforeAll(async () => await startServerIfNotRunning());
afterAll(() => globalServer.forceShutdown());

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

    test('getSchemaJson', async () => {
        let schemaJson = await GetSchemaJson();
        expect(schemaJson).toBeTruthy();

        let actual = JSON.stringify(JSON.parse(schemaJson));
        let expected = JSON.stringify(expectedSchemaObject);
        expect(actual).toBe(expected);
    });

    test('getUIJson', async () => {
        let schemaJson = await GetUIJson();
        expect(schemaJson).toBeTruthy();

        let actual = JSON.stringify(JSON.parse(schemaJson));
        let expected = JSON.stringify(expectedUIObject);
        expect(actual).toBe(expected);
    });
});

describe('plugin module', () => {
    test('connect', async () => await new Promise((resolve) => {
        let client = getGrpcClient();

        let connectRequest = getConnectRequest();
        client.connect(connectRequest, (err) => {
            expect(err).toBe(null);

            client.disconnect(new DisconnectRequest(), (err) => {
                expect(err).toBe(null);
                resolve(null);
            });
        });
    }));

    test('discover all', async () => await new Promise((resolve) => {
        let client = getGrpcClient();

        let configureRequest = getConfigureRequest();
        client.configure(configureRequest, (err) => {
            expect(err).toBe(null);

            let connectRequest = getConnectRequest();
            client.connect(connectRequest, (err) => {
                expect(err).toBe(null);

                let discoverRequest = getDiscoverSchemasRequest();
                client.discoverSchemas(discoverRequest, (err, response) => {
                    expect(err).toBe(null);
                    expect(response).toBeTruthy();

                    let schemasList = response.getSchemasList();
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

                    client.disconnect(new DisconnectRequest(), (err) => {
                        expect(err).toBe(null);
                        resolve(null);
                    });
                });
            });
        });
    }));

    // test('read stream real time', async () => await new Promise((resolve) => {
    //     let client = getGrpcClient();

    //     let connectRequest = getConnectRequest();
    //     client.connect(connectRequest, (err) => {
    //         expect(err).toBe(null);

    //         let discoverRequest = getDiscoverSchemasRequest();
    //         client.discoverSchemas(discoverRequest, (err, response) => {
    //             expect(err).toBe(null);

    //             let schema = response.getSchemasList()?.[0];
    //             expect(schema).toBeTruthy();

    //             let readRequest = getReadRequest();
    //             let responseStream = client.readStream(readRequest);


    //             client.disconnect(new DisconnectRequest(), (err) => {
    //                 expect(err).toBe(null);
    //                 resolve(null);
    //             });
    //         });
    //     });
    // }));
});