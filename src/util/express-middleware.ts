import { RequestHandler } from 'express';
import { RouteParameters } from 'express-serve-static-core';

export type ExpressMiddleware<Route extends string = string> = RequestHandler<RouteParameters<Route>>;