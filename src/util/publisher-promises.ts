import { ServiceError } from "@grpc/grpc-js";
import { SurfaceCall } from "@grpc/grpc-js/build/src/call";
import { PublisherClient } from "../proto/publisher_grpc_pb";

export type PublisherEndpoint<Request, Response> = (
    request: Request, callback: (error: ServiceError | null, response: Response) => void
) => SurfaceCall;

export function endpointPromise<Request, Response>(
    client: PublisherClient,
    endpoint: PublisherEndpoint<Request, Response>,
    request: Request
): Promise<Response> {
    return new Promise<Response>((resolve, reject) => {
        endpoint.call(client, request, (error, response) => {
            if (error) reject(error);
            else resolve(response);
        });
    });
};