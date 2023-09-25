import _ from 'lodash';
import * as http from 'http';

// Jest does not play nicely with custom http packages

export const sendHttpRequest = (
    options: http.RequestOptions,
    requestBody?: any
): Promise<http.IncomingMessage> => {
    const body = _.isNil(requestBody)
        ? ''
        : _.isString(requestBody)
            ? requestBody
            : _.isPlainObject(requestBody)
                ? JSON.stringify(requestBody)
                : `${requestBody}`;

    return new Promise((resolve, reject) => {
        try {
            const request = http.request(
                {
                    ...options,
                    headers: {
                        ...options.headers,
                        'Content-Length': Buffer.byteLength(body)
                    }
                },
                response => resolve(response)
            );
    
            request.socket?.setTimeout?.(5 * 60 * 1000);
    
            request.on('error', err => reject(err));
            request.on('timeout', () => reject(new Error('Request timed out')));
    
            if (!_.isEmpty(body)) request.write(body);
            request.end();
        }
        catch (ex) {
            if (_.isError(ex)) reject(ex);
            else reject(new Error(`${ex}`));
        }
    });
};

export const readHttpResponse = (
    response: http.IncomingMessage
) => {
    return new Promise((resolve, reject) => {
        let body = '';
        response.on('error', err => reject(err));
        response.on('data', chunk => body += `${chunk}`);
        response.on('end', () => resolve(body));
    });
};