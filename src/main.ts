import {
    Server,
    ServerCredentials,
} from '@grpc/grpc-js';

import {
    PublisherService
} from './proto/publisher_grpc_pb';

import { Plugin } from './plugin/plugin';

export function getAppRootDirectory(): string {
    return process.cwd();
}

async function main() {
    // Start server
    const server = new Server();

    server.bindAsync(`0.0.0.0:${0}`, ServerCredentials.createInsecure(), (err, port) => {
        server.addService(PublisherService, new Plugin());
        server.start();

        console.log(`1|1|tcp|localhost:${port}|grpc`);
    });
}

main();