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
import { ConnectRequest, DiscoverSchemasRequest, OAuthConfiguration } from '../proto/publisher_pb';
import { Settings } from '../helper/settings';

let globalPort = -1;
let globalServer: Server;

function startServerIfNotRunning() {
    // Start server
    const server = new Server();

    let ready = new Promise((resolve, reject) => {
        server.bindAsync(`0.0.0.0:${0}`, ServerCredentials.createInsecure(), (err, port) => {
            server.addService(PublisherService, new Plugin());
            server.start();
    
            globalPort = port;
            console.log(`1|1|tcp|localhost:${port}|grpc`);

            resolve(port);
        });
    });

    globalServer = server;

    return ready;
}

function getGrpcClient() {
    let client = new PublisherClient(`localhost:${globalPort}`, credentials.createInsecure());
    return client;
}

function getConnectRequest() {
    let settings: Settings = {
        port: 0,
        tokenValidationEndpoint: '',
        inputSchema: []
    };

    let connectRequest = new ConnectRequest();
    connectRequest.setSettingsJson(JSON.stringify(settings));
    connectRequest.setOauthConfiguration(new OAuthConfiguration());
    connectRequest.setOauthStateJson("");

    return connectRequest;
}

function getDiscoverSchemasRequest() {
    let discoverSchemasRequest = new DiscoverSchemasRequest();
    discoverSchemasRequest.setMode(DiscoverSchemasRequest.Mode.ALL);
    discoverSchemasRequest.setSampleSize(1);

    return discoverSchemasRequest;
}

describe('plugin module', () => {
    // test('connect', () => {
    //     startServerIfNotRunning()
    //     .then((port) => {
    //         let client = getGrpcClient();

    //         let connectRequest = getConnectRequest();
    //         client.connect(connectRequest, (err, response) => {
    //             expect(err).toBe(null);
    //             globalServer.forceShutdown();
    //         })
    //     });
    // });

    test('discover all', async () => {
        let promise = new Promise((resolve, reject) => {
            startServerIfNotRunning()
            .then((port) => {
                let client = getGrpcClient();

                let connectRequest = getConnectRequest();
                client.connect(connectRequest, (err, response) => {
                    expect(err).toBe(null);

                    
                    let discoverRequest = getDiscoverSchemasRequest();
                    client.discoverSchemas(discoverRequest, (err, response) => {
                        expect(err).toBe(null);

                        globalServer.forceShutdown();

                        resolve(null);
                    });
                })
            });
        });
        
        await promise;
    });
});