// package: 
// file: publisher.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as publisher_pb from "./publisher_pb";

interface IPublisherService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    configure: IPublisherService_IConfigure;
    connect: IPublisherService_IConnect;
    connectSession: IPublisherService_IConnectSession;
    discoverShapes: IPublisherService_IDiscoverShapes;
    discoverSchemas: IPublisherService_IDiscoverSchemas;
    discoverSchemasStream: IPublisherService_IDiscoverSchemasStream;
    publishStream: IPublisherService_IPublishStream;
    readStream: IPublisherService_IReadStream;
    disconnect: IPublisherService_IDisconnect;
    configureConnection: IPublisherService_IConfigureConnection;
    configureQuery: IPublisherService_IConfigureQuery;
    configureRealTime: IPublisherService_IConfigureRealTime;
    beginOAuthFlow: IPublisherService_IBeginOAuthFlow;
    completeOAuthFlow: IPublisherService_ICompleteOAuthFlow;
    configureWrite: IPublisherService_IConfigureWrite;
    configureReplication: IPublisherService_IConfigureReplication;
    prepareWrite: IPublisherService_IPrepareWrite;
    writeStream: IPublisherService_IWriteStream;
    discoverRelatedEntities: IPublisherService_IDiscoverRelatedEntities;
}

interface IPublisherService_IConfigure extends grpc.MethodDefinition<publisher_pb.ConfigureRequest, publisher_pb.ConfigureResponse> {
    path: "/Publisher/Configure";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<publisher_pb.ConfigureRequest>;
    requestDeserialize: grpc.deserialize<publisher_pb.ConfigureRequest>;
    responseSerialize: grpc.serialize<publisher_pb.ConfigureResponse>;
    responseDeserialize: grpc.deserialize<publisher_pb.ConfigureResponse>;
}
interface IPublisherService_IConnect extends grpc.MethodDefinition<publisher_pb.ConnectRequest, publisher_pb.ConnectResponse> {
    path: "/Publisher/Connect";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<publisher_pb.ConnectRequest>;
    requestDeserialize: grpc.deserialize<publisher_pb.ConnectRequest>;
    responseSerialize: grpc.serialize<publisher_pb.ConnectResponse>;
    responseDeserialize: grpc.deserialize<publisher_pb.ConnectResponse>;
}
interface IPublisherService_IConnectSession extends grpc.MethodDefinition<publisher_pb.ConnectRequest, publisher_pb.ConnectResponse> {
    path: "/Publisher/ConnectSession";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<publisher_pb.ConnectRequest>;
    requestDeserialize: grpc.deserialize<publisher_pb.ConnectRequest>;
    responseSerialize: grpc.serialize<publisher_pb.ConnectResponse>;
    responseDeserialize: grpc.deserialize<publisher_pb.ConnectResponse>;
}
interface IPublisherService_IDiscoverShapes extends grpc.MethodDefinition<publisher_pb.DiscoverSchemasRequest, publisher_pb.DiscoverSchemasResponse> {
    path: "/Publisher/DiscoverShapes";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<publisher_pb.DiscoverSchemasRequest>;
    requestDeserialize: grpc.deserialize<publisher_pb.DiscoverSchemasRequest>;
    responseSerialize: grpc.serialize<publisher_pb.DiscoverSchemasResponse>;
    responseDeserialize: grpc.deserialize<publisher_pb.DiscoverSchemasResponse>;
}
interface IPublisherService_IDiscoverSchemas extends grpc.MethodDefinition<publisher_pb.DiscoverSchemasRequest, publisher_pb.DiscoverSchemasResponse> {
    path: "/Publisher/DiscoverSchemas";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<publisher_pb.DiscoverSchemasRequest>;
    requestDeserialize: grpc.deserialize<publisher_pb.DiscoverSchemasRequest>;
    responseSerialize: grpc.serialize<publisher_pb.DiscoverSchemasResponse>;
    responseDeserialize: grpc.deserialize<publisher_pb.DiscoverSchemasResponse>;
}
interface IPublisherService_IDiscoverSchemasStream extends grpc.MethodDefinition<publisher_pb.DiscoverSchemasRequest, publisher_pb.Schema> {
    path: "/Publisher/DiscoverSchemasStream";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<publisher_pb.DiscoverSchemasRequest>;
    requestDeserialize: grpc.deserialize<publisher_pb.DiscoverSchemasRequest>;
    responseSerialize: grpc.serialize<publisher_pb.Schema>;
    responseDeserialize: grpc.deserialize<publisher_pb.Schema>;
}
interface IPublisherService_IPublishStream extends grpc.MethodDefinition<publisher_pb.ReadRequest, publisher_pb.Record> {
    path: "/Publisher/PublishStream";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<publisher_pb.ReadRequest>;
    requestDeserialize: grpc.deserialize<publisher_pb.ReadRequest>;
    responseSerialize: grpc.serialize<publisher_pb.Record>;
    responseDeserialize: grpc.deserialize<publisher_pb.Record>;
}
interface IPublisherService_IReadStream extends grpc.MethodDefinition<publisher_pb.ReadRequest, publisher_pb.Record> {
    path: "/Publisher/ReadStream";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<publisher_pb.ReadRequest>;
    requestDeserialize: grpc.deserialize<publisher_pb.ReadRequest>;
    responseSerialize: grpc.serialize<publisher_pb.Record>;
    responseDeserialize: grpc.deserialize<publisher_pb.Record>;
}
interface IPublisherService_IDisconnect extends grpc.MethodDefinition<publisher_pb.DisconnectRequest, publisher_pb.DisconnectResponse> {
    path: "/Publisher/Disconnect";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<publisher_pb.DisconnectRequest>;
    requestDeserialize: grpc.deserialize<publisher_pb.DisconnectRequest>;
    responseSerialize: grpc.serialize<publisher_pb.DisconnectResponse>;
    responseDeserialize: grpc.deserialize<publisher_pb.DisconnectResponse>;
}
interface IPublisherService_IConfigureConnection extends grpc.MethodDefinition<publisher_pb.ConfigureConnectionRequest, publisher_pb.ConfigureConnectionResponse> {
    path: "/Publisher/ConfigureConnection";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<publisher_pb.ConfigureConnectionRequest>;
    requestDeserialize: grpc.deserialize<publisher_pb.ConfigureConnectionRequest>;
    responseSerialize: grpc.serialize<publisher_pb.ConfigureConnectionResponse>;
    responseDeserialize: grpc.deserialize<publisher_pb.ConfigureConnectionResponse>;
}
interface IPublisherService_IConfigureQuery extends grpc.MethodDefinition<publisher_pb.ConfigureQueryRequest, publisher_pb.ConfigureQueryResponse> {
    path: "/Publisher/ConfigureQuery";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<publisher_pb.ConfigureQueryRequest>;
    requestDeserialize: grpc.deserialize<publisher_pb.ConfigureQueryRequest>;
    responseSerialize: grpc.serialize<publisher_pb.ConfigureQueryResponse>;
    responseDeserialize: grpc.deserialize<publisher_pb.ConfigureQueryResponse>;
}
interface IPublisherService_IConfigureRealTime extends grpc.MethodDefinition<publisher_pb.ConfigureRealTimeRequest, publisher_pb.ConfigureRealTimeResponse> {
    path: "/Publisher/ConfigureRealTime";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<publisher_pb.ConfigureRealTimeRequest>;
    requestDeserialize: grpc.deserialize<publisher_pb.ConfigureRealTimeRequest>;
    responseSerialize: grpc.serialize<publisher_pb.ConfigureRealTimeResponse>;
    responseDeserialize: grpc.deserialize<publisher_pb.ConfigureRealTimeResponse>;
}
interface IPublisherService_IBeginOAuthFlow extends grpc.MethodDefinition<publisher_pb.BeginOAuthFlowRequest, publisher_pb.BeginOAuthFlowResponse> {
    path: "/Publisher/BeginOAuthFlow";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<publisher_pb.BeginOAuthFlowRequest>;
    requestDeserialize: grpc.deserialize<publisher_pb.BeginOAuthFlowRequest>;
    responseSerialize: grpc.serialize<publisher_pb.BeginOAuthFlowResponse>;
    responseDeserialize: grpc.deserialize<publisher_pb.BeginOAuthFlowResponse>;
}
interface IPublisherService_ICompleteOAuthFlow extends grpc.MethodDefinition<publisher_pb.CompleteOAuthFlowRequest, publisher_pb.CompleteOAuthFlowResponse> {
    path: "/Publisher/CompleteOAuthFlow";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<publisher_pb.CompleteOAuthFlowRequest>;
    requestDeserialize: grpc.deserialize<publisher_pb.CompleteOAuthFlowRequest>;
    responseSerialize: grpc.serialize<publisher_pb.CompleteOAuthFlowResponse>;
    responseDeserialize: grpc.deserialize<publisher_pb.CompleteOAuthFlowResponse>;
}
interface IPublisherService_IConfigureWrite extends grpc.MethodDefinition<publisher_pb.ConfigureWriteRequest, publisher_pb.ConfigureWriteResponse> {
    path: "/Publisher/ConfigureWrite";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<publisher_pb.ConfigureWriteRequest>;
    requestDeserialize: grpc.deserialize<publisher_pb.ConfigureWriteRequest>;
    responseSerialize: grpc.serialize<publisher_pb.ConfigureWriteResponse>;
    responseDeserialize: grpc.deserialize<publisher_pb.ConfigureWriteResponse>;
}
interface IPublisherService_IConfigureReplication extends grpc.MethodDefinition<publisher_pb.ConfigureReplicationRequest, publisher_pb.ConfigureReplicationResponse> {
    path: "/Publisher/ConfigureReplication";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<publisher_pb.ConfigureReplicationRequest>;
    requestDeserialize: grpc.deserialize<publisher_pb.ConfigureReplicationRequest>;
    responseSerialize: grpc.serialize<publisher_pb.ConfigureReplicationResponse>;
    responseDeserialize: grpc.deserialize<publisher_pb.ConfigureReplicationResponse>;
}
interface IPublisherService_IPrepareWrite extends grpc.MethodDefinition<publisher_pb.PrepareWriteRequest, publisher_pb.PrepareWriteResponse> {
    path: "/Publisher/PrepareWrite";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<publisher_pb.PrepareWriteRequest>;
    requestDeserialize: grpc.deserialize<publisher_pb.PrepareWriteRequest>;
    responseSerialize: grpc.serialize<publisher_pb.PrepareWriteResponse>;
    responseDeserialize: grpc.deserialize<publisher_pb.PrepareWriteResponse>;
}
interface IPublisherService_IWriteStream extends grpc.MethodDefinition<publisher_pb.Record, publisher_pb.RecordAck> {
    path: "/Publisher/WriteStream";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<publisher_pb.Record>;
    requestDeserialize: grpc.deserialize<publisher_pb.Record>;
    responseSerialize: grpc.serialize<publisher_pb.RecordAck>;
    responseDeserialize: grpc.deserialize<publisher_pb.RecordAck>;
}
interface IPublisherService_IDiscoverRelatedEntities extends grpc.MethodDefinition<publisher_pb.DiscoverRelatedEntitiesRequest, publisher_pb.DiscoverRelatedEntitiesResponse> {
    path: "/Publisher/DiscoverRelatedEntities";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<publisher_pb.DiscoverRelatedEntitiesRequest>;
    requestDeserialize: grpc.deserialize<publisher_pb.DiscoverRelatedEntitiesRequest>;
    responseSerialize: grpc.serialize<publisher_pb.DiscoverRelatedEntitiesResponse>;
    responseDeserialize: grpc.deserialize<publisher_pb.DiscoverRelatedEntitiesResponse>;
}

export const PublisherService: IPublisherService;

export interface IPublisherServer extends grpc.UntypedServiceImplementation {
    configure: grpc.handleUnaryCall<publisher_pb.ConfigureRequest, publisher_pb.ConfigureResponse>;
    connect: grpc.handleUnaryCall<publisher_pb.ConnectRequest, publisher_pb.ConnectResponse>;
    connectSession: grpc.handleServerStreamingCall<publisher_pb.ConnectRequest, publisher_pb.ConnectResponse>;
    discoverShapes: grpc.handleUnaryCall<publisher_pb.DiscoverSchemasRequest, publisher_pb.DiscoverSchemasResponse>;
    discoverSchemas: grpc.handleUnaryCall<publisher_pb.DiscoverSchemasRequest, publisher_pb.DiscoverSchemasResponse>;
    discoverSchemasStream: grpc.handleServerStreamingCall<publisher_pb.DiscoverSchemasRequest, publisher_pb.Schema>;
    publishStream: grpc.handleServerStreamingCall<publisher_pb.ReadRequest, publisher_pb.Record>;
    readStream: grpc.handleServerStreamingCall<publisher_pb.ReadRequest, publisher_pb.Record>;
    disconnect: grpc.handleUnaryCall<publisher_pb.DisconnectRequest, publisher_pb.DisconnectResponse>;
    configureConnection: grpc.handleUnaryCall<publisher_pb.ConfigureConnectionRequest, publisher_pb.ConfigureConnectionResponse>;
    configureQuery: grpc.handleUnaryCall<publisher_pb.ConfigureQueryRequest, publisher_pb.ConfigureQueryResponse>;
    configureRealTime: grpc.handleUnaryCall<publisher_pb.ConfigureRealTimeRequest, publisher_pb.ConfigureRealTimeResponse>;
    beginOAuthFlow: grpc.handleUnaryCall<publisher_pb.BeginOAuthFlowRequest, publisher_pb.BeginOAuthFlowResponse>;
    completeOAuthFlow: grpc.handleUnaryCall<publisher_pb.CompleteOAuthFlowRequest, publisher_pb.CompleteOAuthFlowResponse>;
    configureWrite: grpc.handleUnaryCall<publisher_pb.ConfigureWriteRequest, publisher_pb.ConfigureWriteResponse>;
    configureReplication: grpc.handleUnaryCall<publisher_pb.ConfigureReplicationRequest, publisher_pb.ConfigureReplicationResponse>;
    prepareWrite: grpc.handleUnaryCall<publisher_pb.PrepareWriteRequest, publisher_pb.PrepareWriteResponse>;
    writeStream: grpc.handleBidiStreamingCall<publisher_pb.Record, publisher_pb.RecordAck>;
    discoverRelatedEntities: grpc.handleUnaryCall<publisher_pb.DiscoverRelatedEntitiesRequest, publisher_pb.DiscoverRelatedEntitiesResponse>;
}

export interface IPublisherClient {
    configure(request: publisher_pb.ConfigureRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureResponse) => void): grpc.ClientUnaryCall;
    configure(request: publisher_pb.ConfigureRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureResponse) => void): grpc.ClientUnaryCall;
    configure(request: publisher_pb.ConfigureRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureResponse) => void): grpc.ClientUnaryCall;
    connect(request: publisher_pb.ConnectRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    connect(request: publisher_pb.ConnectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    connect(request: publisher_pb.ConnectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    connectSession(request: publisher_pb.ConnectRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<publisher_pb.ConnectResponse>;
    connectSession(request: publisher_pb.ConnectRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<publisher_pb.ConnectResponse>;
    discoverShapes(request: publisher_pb.DiscoverSchemasRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.DiscoverSchemasResponse) => void): grpc.ClientUnaryCall;
    discoverShapes(request: publisher_pb.DiscoverSchemasRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.DiscoverSchemasResponse) => void): grpc.ClientUnaryCall;
    discoverShapes(request: publisher_pb.DiscoverSchemasRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.DiscoverSchemasResponse) => void): grpc.ClientUnaryCall;
    discoverSchemas(request: publisher_pb.DiscoverSchemasRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.DiscoverSchemasResponse) => void): grpc.ClientUnaryCall;
    discoverSchemas(request: publisher_pb.DiscoverSchemasRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.DiscoverSchemasResponse) => void): grpc.ClientUnaryCall;
    discoverSchemas(request: publisher_pb.DiscoverSchemasRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.DiscoverSchemasResponse) => void): grpc.ClientUnaryCall;
    discoverSchemasStream(request: publisher_pb.DiscoverSchemasRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<publisher_pb.Schema>;
    discoverSchemasStream(request: publisher_pb.DiscoverSchemasRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<publisher_pb.Schema>;
    publishStream(request: publisher_pb.ReadRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<publisher_pb.Record>;
    publishStream(request: publisher_pb.ReadRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<publisher_pb.Record>;
    readStream(request: publisher_pb.ReadRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<publisher_pb.Record>;
    readStream(request: publisher_pb.ReadRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<publisher_pb.Record>;
    disconnect(request: publisher_pb.DisconnectRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.DisconnectResponse) => void): grpc.ClientUnaryCall;
    disconnect(request: publisher_pb.DisconnectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.DisconnectResponse) => void): grpc.ClientUnaryCall;
    disconnect(request: publisher_pb.DisconnectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.DisconnectResponse) => void): grpc.ClientUnaryCall;
    configureConnection(request: publisher_pb.ConfigureConnectionRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureConnectionResponse) => void): grpc.ClientUnaryCall;
    configureConnection(request: publisher_pb.ConfigureConnectionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureConnectionResponse) => void): grpc.ClientUnaryCall;
    configureConnection(request: publisher_pb.ConfigureConnectionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureConnectionResponse) => void): grpc.ClientUnaryCall;
    configureQuery(request: publisher_pb.ConfigureQueryRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureQueryResponse) => void): grpc.ClientUnaryCall;
    configureQuery(request: publisher_pb.ConfigureQueryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureQueryResponse) => void): grpc.ClientUnaryCall;
    configureQuery(request: publisher_pb.ConfigureQueryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureQueryResponse) => void): grpc.ClientUnaryCall;
    configureRealTime(request: publisher_pb.ConfigureRealTimeRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureRealTimeResponse) => void): grpc.ClientUnaryCall;
    configureRealTime(request: publisher_pb.ConfigureRealTimeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureRealTimeResponse) => void): grpc.ClientUnaryCall;
    configureRealTime(request: publisher_pb.ConfigureRealTimeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureRealTimeResponse) => void): grpc.ClientUnaryCall;
    beginOAuthFlow(request: publisher_pb.BeginOAuthFlowRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.BeginOAuthFlowResponse) => void): grpc.ClientUnaryCall;
    beginOAuthFlow(request: publisher_pb.BeginOAuthFlowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.BeginOAuthFlowResponse) => void): grpc.ClientUnaryCall;
    beginOAuthFlow(request: publisher_pb.BeginOAuthFlowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.BeginOAuthFlowResponse) => void): grpc.ClientUnaryCall;
    completeOAuthFlow(request: publisher_pb.CompleteOAuthFlowRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.CompleteOAuthFlowResponse) => void): grpc.ClientUnaryCall;
    completeOAuthFlow(request: publisher_pb.CompleteOAuthFlowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.CompleteOAuthFlowResponse) => void): grpc.ClientUnaryCall;
    completeOAuthFlow(request: publisher_pb.CompleteOAuthFlowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.CompleteOAuthFlowResponse) => void): grpc.ClientUnaryCall;
    configureWrite(request: publisher_pb.ConfigureWriteRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureWriteResponse) => void): grpc.ClientUnaryCall;
    configureWrite(request: publisher_pb.ConfigureWriteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureWriteResponse) => void): grpc.ClientUnaryCall;
    configureWrite(request: publisher_pb.ConfigureWriteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureWriteResponse) => void): grpc.ClientUnaryCall;
    configureReplication(request: publisher_pb.ConfigureReplicationRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureReplicationResponse) => void): grpc.ClientUnaryCall;
    configureReplication(request: publisher_pb.ConfigureReplicationRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureReplicationResponse) => void): grpc.ClientUnaryCall;
    configureReplication(request: publisher_pb.ConfigureReplicationRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureReplicationResponse) => void): grpc.ClientUnaryCall;
    prepareWrite(request: publisher_pb.PrepareWriteRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.PrepareWriteResponse) => void): grpc.ClientUnaryCall;
    prepareWrite(request: publisher_pb.PrepareWriteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.PrepareWriteResponse) => void): grpc.ClientUnaryCall;
    prepareWrite(request: publisher_pb.PrepareWriteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.PrepareWriteResponse) => void): grpc.ClientUnaryCall;
    writeStream(): grpc.ClientDuplexStream<publisher_pb.Record, publisher_pb.RecordAck>;
    writeStream(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<publisher_pb.Record, publisher_pb.RecordAck>;
    writeStream(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<publisher_pb.Record, publisher_pb.RecordAck>;
    discoverRelatedEntities(request: publisher_pb.DiscoverRelatedEntitiesRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.DiscoverRelatedEntitiesResponse) => void): grpc.ClientUnaryCall;
    discoverRelatedEntities(request: publisher_pb.DiscoverRelatedEntitiesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.DiscoverRelatedEntitiesResponse) => void): grpc.ClientUnaryCall;
    discoverRelatedEntities(request: publisher_pb.DiscoverRelatedEntitiesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.DiscoverRelatedEntitiesResponse) => void): grpc.ClientUnaryCall;
}

export class PublisherClient extends grpc.Client implements IPublisherClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public configure(request: publisher_pb.ConfigureRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureResponse) => void): grpc.ClientUnaryCall;
    public configure(request: publisher_pb.ConfigureRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureResponse) => void): grpc.ClientUnaryCall;
    public configure(request: publisher_pb.ConfigureRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureResponse) => void): grpc.ClientUnaryCall;
    public connect(request: publisher_pb.ConnectRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    public connect(request: publisher_pb.ConnectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    public connect(request: publisher_pb.ConnectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    public connectSession(request: publisher_pb.ConnectRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<publisher_pb.ConnectResponse>;
    public connectSession(request: publisher_pb.ConnectRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<publisher_pb.ConnectResponse>;
    public discoverShapes(request: publisher_pb.DiscoverSchemasRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.DiscoverSchemasResponse) => void): grpc.ClientUnaryCall;
    public discoverShapes(request: publisher_pb.DiscoverSchemasRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.DiscoverSchemasResponse) => void): grpc.ClientUnaryCall;
    public discoverShapes(request: publisher_pb.DiscoverSchemasRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.DiscoverSchemasResponse) => void): grpc.ClientUnaryCall;
    public discoverSchemas(request: publisher_pb.DiscoverSchemasRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.DiscoverSchemasResponse) => void): grpc.ClientUnaryCall;
    public discoverSchemas(request: publisher_pb.DiscoverSchemasRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.DiscoverSchemasResponse) => void): grpc.ClientUnaryCall;
    public discoverSchemas(request: publisher_pb.DiscoverSchemasRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.DiscoverSchemasResponse) => void): grpc.ClientUnaryCall;
    public discoverSchemasStream(request: publisher_pb.DiscoverSchemasRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<publisher_pb.Schema>;
    public discoverSchemasStream(request: publisher_pb.DiscoverSchemasRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<publisher_pb.Schema>;
    public publishStream(request: publisher_pb.ReadRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<publisher_pb.Record>;
    public publishStream(request: publisher_pb.ReadRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<publisher_pb.Record>;
    public readStream(request: publisher_pb.ReadRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<publisher_pb.Record>;
    public readStream(request: publisher_pb.ReadRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<publisher_pb.Record>;
    public disconnect(request: publisher_pb.DisconnectRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.DisconnectResponse) => void): grpc.ClientUnaryCall;
    public disconnect(request: publisher_pb.DisconnectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.DisconnectResponse) => void): grpc.ClientUnaryCall;
    public disconnect(request: publisher_pb.DisconnectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.DisconnectResponse) => void): grpc.ClientUnaryCall;
    public configureConnection(request: publisher_pb.ConfigureConnectionRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureConnectionResponse) => void): grpc.ClientUnaryCall;
    public configureConnection(request: publisher_pb.ConfigureConnectionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureConnectionResponse) => void): grpc.ClientUnaryCall;
    public configureConnection(request: publisher_pb.ConfigureConnectionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureConnectionResponse) => void): grpc.ClientUnaryCall;
    public configureQuery(request: publisher_pb.ConfigureQueryRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureQueryResponse) => void): grpc.ClientUnaryCall;
    public configureQuery(request: publisher_pb.ConfigureQueryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureQueryResponse) => void): grpc.ClientUnaryCall;
    public configureQuery(request: publisher_pb.ConfigureQueryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureQueryResponse) => void): grpc.ClientUnaryCall;
    public configureRealTime(request: publisher_pb.ConfigureRealTimeRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureRealTimeResponse) => void): grpc.ClientUnaryCall;
    public configureRealTime(request: publisher_pb.ConfigureRealTimeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureRealTimeResponse) => void): grpc.ClientUnaryCall;
    public configureRealTime(request: publisher_pb.ConfigureRealTimeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureRealTimeResponse) => void): grpc.ClientUnaryCall;
    public beginOAuthFlow(request: publisher_pb.BeginOAuthFlowRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.BeginOAuthFlowResponse) => void): grpc.ClientUnaryCall;
    public beginOAuthFlow(request: publisher_pb.BeginOAuthFlowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.BeginOAuthFlowResponse) => void): grpc.ClientUnaryCall;
    public beginOAuthFlow(request: publisher_pb.BeginOAuthFlowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.BeginOAuthFlowResponse) => void): grpc.ClientUnaryCall;
    public completeOAuthFlow(request: publisher_pb.CompleteOAuthFlowRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.CompleteOAuthFlowResponse) => void): grpc.ClientUnaryCall;
    public completeOAuthFlow(request: publisher_pb.CompleteOAuthFlowRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.CompleteOAuthFlowResponse) => void): grpc.ClientUnaryCall;
    public completeOAuthFlow(request: publisher_pb.CompleteOAuthFlowRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.CompleteOAuthFlowResponse) => void): grpc.ClientUnaryCall;
    public configureWrite(request: publisher_pb.ConfigureWriteRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureWriteResponse) => void): grpc.ClientUnaryCall;
    public configureWrite(request: publisher_pb.ConfigureWriteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureWriteResponse) => void): grpc.ClientUnaryCall;
    public configureWrite(request: publisher_pb.ConfigureWriteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureWriteResponse) => void): grpc.ClientUnaryCall;
    public configureReplication(request: publisher_pb.ConfigureReplicationRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureReplicationResponse) => void): grpc.ClientUnaryCall;
    public configureReplication(request: publisher_pb.ConfigureReplicationRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureReplicationResponse) => void): grpc.ClientUnaryCall;
    public configureReplication(request: publisher_pb.ConfigureReplicationRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.ConfigureReplicationResponse) => void): grpc.ClientUnaryCall;
    public prepareWrite(request: publisher_pb.PrepareWriteRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.PrepareWriteResponse) => void): grpc.ClientUnaryCall;
    public prepareWrite(request: publisher_pb.PrepareWriteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.PrepareWriteResponse) => void): grpc.ClientUnaryCall;
    public prepareWrite(request: publisher_pb.PrepareWriteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.PrepareWriteResponse) => void): grpc.ClientUnaryCall;
    public writeStream(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<publisher_pb.Record, publisher_pb.RecordAck>;
    public writeStream(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<publisher_pb.Record, publisher_pb.RecordAck>;
    public discoverRelatedEntities(request: publisher_pb.DiscoverRelatedEntitiesRequest, callback: (error: grpc.ServiceError | null, response: publisher_pb.DiscoverRelatedEntitiesResponse) => void): grpc.ClientUnaryCall;
    public discoverRelatedEntities(request: publisher_pb.DiscoverRelatedEntitiesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: publisher_pb.DiscoverRelatedEntitiesResponse) => void): grpc.ClientUnaryCall;
    public discoverRelatedEntities(request: publisher_pb.DiscoverRelatedEntitiesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: publisher_pb.DiscoverRelatedEntitiesResponse) => void): grpc.ClientUnaryCall;
}
