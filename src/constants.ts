import * as http from 'http';

const timeout = 3000;
const port = 50001;
const hostname = 'localhost';
export const defaultTimeout = timeout;
export const defaultPort = port;
export const defulatHostname = hostname;

export const requestPaths = {
    PluginInfo: '/plugininfo',
    ExternalPush: '/externalpush',
};

export const requestOptions = {
    PostRecord: {
        hostname,
        port,
        path: requestPaths.ExternalPush,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        timeout
    } as http.RequestOptions,
    DeleteRecord: {
        hostname,
        port,
        path: requestPaths.ExternalPush,
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        timeout
    } as http.RequestOptions,
    GetPluginInfo: {
        hostname,
        port,
        path: requestPaths.PluginInfo,
        method: 'GET',
        timeout
    } as http.RequestOptions
};