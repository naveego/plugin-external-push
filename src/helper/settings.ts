import _ from 'lodash';
import { LogParams, Logger } from '../logger/logger';
import { checkPortStatus } from 'portscanner';
import { readHttpResponse, sendHttpRequest } from '../util/http-request';
import * as constants from '../constants';

export interface Settings {
    connectionId: string;
    port: number;
    tokenValidationEndpoint: string;
    inputSchema: InputSchemaProperty[];
}

export interface InputSchemaProperty {
    propertyName: string;
    propertyType: string;
}

export function ValidateSettings(settings: Settings): void {
    if (_.isEmpty(settings.connectionId)) {
        throw new Error('Connection ID is undefined');
    }

    if (_.isNil(settings.port)) {
        throw new Error('Port is undefined');
    }
    else if (settings.port <= 0) {
        throw new Error('Invalid port number');
    }

    if (settings.inputSchema.length <= 0) {
        throw new Error('At least one Input Schema Property must be defined');
    }

    let propertyNames = _.cloneDeep(settings.inputSchema.map(p => p.propertyName));
    settings.inputSchema.forEach((prop, i) => {
        // clear property name so that it isn't tripping duplicates check
        propertyNames[i] = '';

        if (!prop.propertyName) {
            throw new Error(`Input Schema: Property ${i+1} does not have a name`);
        }
        if (!prop.propertyType) {
            throw new Error(`Input Schema: Property \'${prop.propertyName}\' does not have a type`);
        }
        if (propertyNames.includes(prop.propertyName)) {
            throw new Error(`Input Schema: Found duplicate properties with name \'${prop.propertyName}\'`);
        }
    });

    if (settings.tokenValidationEndpoint) {
        let urlRegex = new RegExp(/^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/);
        if (!urlRegex.test(settings.tokenValidationEndpoint)) {
            throw new Error('Token validation endpoint is not a valid URL');
        }
    }
}

export async function CheckPortAvailability(settings: Settings, logger: Logger, logParams?: LogParams): Promise<void> {
    if (!settings.port) {
        throw new Error('Port is undefined');
    }

    const portStatus = await checkPortStatus(settings.port);
    logger.Debug(`Port check - localhost:${settings.port} is ${portStatus.toUpperCase()}`, logParams);

    if (portStatus === 'closed') return;

    try {
        const pluginResponse = await sendHttpRequest({
            ...constants.requestOptions.GetPluginInfo,
            port: settings.port
        });
        if (_.isNil(pluginResponse.statusCode)) {
            logger.Debug('Received null status code when making a request to the target endpoint', logParams);
            throw new Error();
        }
        if (pluginResponse.statusCode !== 200) {
            logger.Debug(
                `Received invalid status code ${pluginResponse.statusCode} when making a request to the target endpoint`,
                logParams
            );
            throw new Error();
        }

        const body = await readHttpResponse(pluginResponse);

        if (_.isString(body)) {
            if (body.startsWith('Name: ')) {
                const connection_id = body.slice(6);
                if (!_.isEmpty(connection_id) && connection_id === settings.connectionId) {
                    return;
                }
            }
        }

        logger.Debug('Got valid response, but was unable to parse it', logParams);
        throw new Error();
    }
    catch (err) {
        throw new Error(`Address localhost:${settings.port} is already being used`);
    }
}