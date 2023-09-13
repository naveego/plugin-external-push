import { Server } from 'net';
import { ConfigureRequest } from '../proto/publisher_pb';
import { Settings } from './settings';

export interface ServerStatus {
    connected: boolean;
    config?: ConfigureRequest;
    settings: Settings;
    expressServer: Server | undefined;
}