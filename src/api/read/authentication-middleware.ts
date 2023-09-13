import { Express } from 'express';

export async function InjectAuthenticationMiddleware(app: Express): Promise<Express> {
    app.post('/authenticate', (req, res, next) => {
        try {
            // TODO: create authentication middleware
            // Get JWT Token
            // Decode JWT Token
            // Get UserId
            // Throw error on invalid user id
            next();
        }
        catch {
            res.status(401).json({
                error: new Error('Invalid request!')
            });
        }
    });

    return app;
}