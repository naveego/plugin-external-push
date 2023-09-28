import _ from 'lodash';
import { ExpressMiddleware } from '../../util/express-middleware';
import jwt from 'jsonwebtoken';
import JwksRsa, { JwksClient } from 'jwks-rsa';
import { LogParams, Logger } from '../../logger/logger';
import * as constants from '../../constants';

let jwksClient: JwksClient | undefined = undefined;
let currentAuthUrl: string = '';

export const AuthenticationMiddleware = (
    authUrl: string,
    logger: Logger,
    logParams: LogParams
): ExpressMiddleware => async (req, res, next) => {
    let errDetails: {
        error: Error,
        status: number,
        msg: string,
    } | undefined = undefined;
    try { // return jumps to finally block
        // don't authenticate for the Get Plugin Info request
        const getPluginInfo = constants.requestOptions.GetPluginInfo;
        if (req.path === getPluginInfo.path && req.method === getPluginInfo.method)
            return;

        if (_.isEmpty(authUrl)) {
            logger.Debug('No auth url provided, skipping authentication', logParams);
            return;
        }

        if (authUrl !== currentAuthUrl) {
            currentAuthUrl = authUrl;
            jwksClient = JwksRsa({
                jwksUri: authUrl,
                timeout: 30000,
                requestHeaders: { 'Accept': 'application/json' },
            });
        }

        if (!jwksClient) { // enforces that jwksClient is truthy in Typescript runtime
            errDetails = {
                error: new Error('Auth client is not running'),
                status: 500,
                msg: 'Server error',
            };
            return;
        }

        // get bearer token
        const encodedToken = req.headers.authorization?.replace('Bearer ', '') || '';
        if (!encodedToken) {
            errDetails = {
                error: new Error('Bearer token is missing from the request'),
                status: 401,
                msg: 'Unathenticated request',
            };
            return;
        }

        // decode token
        const decodedToken = jwt.decode(encodedToken, { complete: true });
        if (!decodedToken) {
            errDetails = {
                error: new Error('Unable to decode bearer token in the request'),
                status: 401,
                msg: 'Unauthenticated request',
            };
            return;
        }

        try {
            const signingKey = await jwksClient.getSigningKey(decodedToken.header.kid);
            jwt.verify(encodedToken, signingKey.getPublicKey(), {
                algorithms: ['RS256'],
            });
        }
        catch {
            const isHttps = authUrl.startsWith('https://');
            errDetails = {
                error: new Error(`Invalid bearer token${
                    isHttps ? ' or certificate is not trusted' : ''
                }`),
                status: 403,
                msg: 'Unauthorized request',
            };
            return;
        }

        logger.Debug('Authentication succeeded', logParams);
    }
    finally {
        if (errDetails) {
            logger.Error(errDetails.error, errDetails.msg, logParams);
            res.status(errDetails.status);
            // // TESTING: Only uncomment when testing
            //res.write(errDetails.error.stack);
            res.end();
        }

        next(errDetails?.error); // Will be undefined on no error
    }
};