// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var publisher_pb = require('./publisher_pb.js');

function serialize_BeginOAuthFlowRequest(arg) {
  if (!(arg instanceof publisher_pb.BeginOAuthFlowRequest)) {
    throw new Error('Expected argument of type BeginOAuthFlowRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_BeginOAuthFlowRequest(buffer_arg) {
  return publisher_pb.BeginOAuthFlowRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_BeginOAuthFlowResponse(arg) {
  if (!(arg instanceof publisher_pb.BeginOAuthFlowResponse)) {
    throw new Error('Expected argument of type BeginOAuthFlowResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_BeginOAuthFlowResponse(buffer_arg) {
  return publisher_pb.BeginOAuthFlowResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_CompleteOAuthFlowRequest(arg) {
  if (!(arg instanceof publisher_pb.CompleteOAuthFlowRequest)) {
    throw new Error('Expected argument of type CompleteOAuthFlowRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_CompleteOAuthFlowRequest(buffer_arg) {
  return publisher_pb.CompleteOAuthFlowRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_CompleteOAuthFlowResponse(arg) {
  if (!(arg instanceof publisher_pb.CompleteOAuthFlowResponse)) {
    throw new Error('Expected argument of type CompleteOAuthFlowResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_CompleteOAuthFlowResponse(buffer_arg) {
  return publisher_pb.CompleteOAuthFlowResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ConfigureConnectionRequest(arg) {
  if (!(arg instanceof publisher_pb.ConfigureConnectionRequest)) {
    throw new Error('Expected argument of type ConfigureConnectionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ConfigureConnectionRequest(buffer_arg) {
  return publisher_pb.ConfigureConnectionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ConfigureConnectionResponse(arg) {
  if (!(arg instanceof publisher_pb.ConfigureConnectionResponse)) {
    throw new Error('Expected argument of type ConfigureConnectionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ConfigureConnectionResponse(buffer_arg) {
  return publisher_pb.ConfigureConnectionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ConfigureQueryRequest(arg) {
  if (!(arg instanceof publisher_pb.ConfigureQueryRequest)) {
    throw new Error('Expected argument of type ConfigureQueryRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ConfigureQueryRequest(buffer_arg) {
  return publisher_pb.ConfigureQueryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ConfigureQueryResponse(arg) {
  if (!(arg instanceof publisher_pb.ConfigureQueryResponse)) {
    throw new Error('Expected argument of type ConfigureQueryResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ConfigureQueryResponse(buffer_arg) {
  return publisher_pb.ConfigureQueryResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ConfigureRealTimeRequest(arg) {
  if (!(arg instanceof publisher_pb.ConfigureRealTimeRequest)) {
    throw new Error('Expected argument of type ConfigureRealTimeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ConfigureRealTimeRequest(buffer_arg) {
  return publisher_pb.ConfigureRealTimeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ConfigureRealTimeResponse(arg) {
  if (!(arg instanceof publisher_pb.ConfigureRealTimeResponse)) {
    throw new Error('Expected argument of type ConfigureRealTimeResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ConfigureRealTimeResponse(buffer_arg) {
  return publisher_pb.ConfigureRealTimeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ConfigureReplicationRequest(arg) {
  if (!(arg instanceof publisher_pb.ConfigureReplicationRequest)) {
    throw new Error('Expected argument of type ConfigureReplicationRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ConfigureReplicationRequest(buffer_arg) {
  return publisher_pb.ConfigureReplicationRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ConfigureReplicationResponse(arg) {
  if (!(arg instanceof publisher_pb.ConfigureReplicationResponse)) {
    throw new Error('Expected argument of type ConfigureReplicationResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ConfigureReplicationResponse(buffer_arg) {
  return publisher_pb.ConfigureReplicationResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ConfigureRequest(arg) {
  if (!(arg instanceof publisher_pb.ConfigureRequest)) {
    throw new Error('Expected argument of type ConfigureRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ConfigureRequest(buffer_arg) {
  return publisher_pb.ConfigureRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ConfigureResponse(arg) {
  if (!(arg instanceof publisher_pb.ConfigureResponse)) {
    throw new Error('Expected argument of type ConfigureResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ConfigureResponse(buffer_arg) {
  return publisher_pb.ConfigureResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ConfigureWriteRequest(arg) {
  if (!(arg instanceof publisher_pb.ConfigureWriteRequest)) {
    throw new Error('Expected argument of type ConfigureWriteRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ConfigureWriteRequest(buffer_arg) {
  return publisher_pb.ConfigureWriteRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ConfigureWriteResponse(arg) {
  if (!(arg instanceof publisher_pb.ConfigureWriteResponse)) {
    throw new Error('Expected argument of type ConfigureWriteResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ConfigureWriteResponse(buffer_arg) {
  return publisher_pb.ConfigureWriteResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ConnectRequest(arg) {
  if (!(arg instanceof publisher_pb.ConnectRequest)) {
    throw new Error('Expected argument of type ConnectRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ConnectRequest(buffer_arg) {
  return publisher_pb.ConnectRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ConnectResponse(arg) {
  if (!(arg instanceof publisher_pb.ConnectResponse)) {
    throw new Error('Expected argument of type ConnectResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ConnectResponse(buffer_arg) {
  return publisher_pb.ConnectResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DisconnectRequest(arg) {
  if (!(arg instanceof publisher_pb.DisconnectRequest)) {
    throw new Error('Expected argument of type DisconnectRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DisconnectRequest(buffer_arg) {
  return publisher_pb.DisconnectRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DisconnectResponse(arg) {
  if (!(arg instanceof publisher_pb.DisconnectResponse)) {
    throw new Error('Expected argument of type DisconnectResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DisconnectResponse(buffer_arg) {
  return publisher_pb.DisconnectResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DiscoverRelatedEntitiesRequest(arg) {
  if (!(arg instanceof publisher_pb.DiscoverRelatedEntitiesRequest)) {
    throw new Error('Expected argument of type DiscoverRelatedEntitiesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DiscoverRelatedEntitiesRequest(buffer_arg) {
  return publisher_pb.DiscoverRelatedEntitiesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DiscoverRelatedEntitiesResponse(arg) {
  if (!(arg instanceof publisher_pb.DiscoverRelatedEntitiesResponse)) {
    throw new Error('Expected argument of type DiscoverRelatedEntitiesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DiscoverRelatedEntitiesResponse(buffer_arg) {
  return publisher_pb.DiscoverRelatedEntitiesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DiscoverSchemasRequest(arg) {
  if (!(arg instanceof publisher_pb.DiscoverSchemasRequest)) {
    throw new Error('Expected argument of type DiscoverSchemasRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DiscoverSchemasRequest(buffer_arg) {
  return publisher_pb.DiscoverSchemasRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DiscoverSchemasResponse(arg) {
  if (!(arg instanceof publisher_pb.DiscoverSchemasResponse)) {
    throw new Error('Expected argument of type DiscoverSchemasResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DiscoverSchemasResponse(buffer_arg) {
  return publisher_pb.DiscoverSchemasResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_PrepareWriteRequest(arg) {
  if (!(arg instanceof publisher_pb.PrepareWriteRequest)) {
    throw new Error('Expected argument of type PrepareWriteRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_PrepareWriteRequest(buffer_arg) {
  return publisher_pb.PrepareWriteRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_PrepareWriteResponse(arg) {
  if (!(arg instanceof publisher_pb.PrepareWriteResponse)) {
    throw new Error('Expected argument of type PrepareWriteResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_PrepareWriteResponse(buffer_arg) {
  return publisher_pb.PrepareWriteResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ReadRequest(arg) {
  if (!(arg instanceof publisher_pb.ReadRequest)) {
    throw new Error('Expected argument of type ReadRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ReadRequest(buffer_arg) {
  return publisher_pb.ReadRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_Record(arg) {
  if (!(arg instanceof publisher_pb.Record)) {
    throw new Error('Expected argument of type Record');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_Record(buffer_arg) {
  return publisher_pb.Record.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_RecordAck(arg) {
  if (!(arg instanceof publisher_pb.RecordAck)) {
    throw new Error('Expected argument of type RecordAck');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RecordAck(buffer_arg) {
  return publisher_pb.RecordAck.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_Schema(arg) {
  if (!(arg instanceof publisher_pb.Schema)) {
    throw new Error('Expected argument of type Schema');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_Schema(buffer_arg) {
  return publisher_pb.Schema.deserializeBinary(new Uint8Array(buffer_arg));
}


var PublisherService = exports.PublisherService = {
  // Configures the plugin.
configure: {
    path: '/pub.Publisher/Configure',
    requestStream: false,
    responseStream: false,
    requestType: publisher_pb.ConfigureRequest,
    responseType: publisher_pb.ConfigureResponse,
    requestSerialize: serialize_ConfigureRequest,
    requestDeserialize: deserialize_ConfigureRequest,
    responseSerialize: serialize_ConfigureResponse,
    responseDeserialize: deserialize_ConfigureResponse,
  },
  // Instructs the plugin to connect to its data source.
connect: {
    path: '/pub.Publisher/Connect',
    requestStream: false,
    responseStream: false,
    requestType: publisher_pb.ConnectRequest,
    responseType: publisher_pb.ConnectResponse,
    requestSerialize: serialize_ConnectRequest,
    requestDeserialize: deserialize_ConnectRequest,
    responseSerialize: serialize_ConnectResponse,
    responseDeserialize: deserialize_ConnectResponse,
  },
  // Instructs the plugin to connect to its data source
// and maintain a session where any change in the connection state
// or updates to OAuth information are streamed back to the host.
// The plugin should maintain this connection until Disconnect is called.
// This must be implemented if the plugin manifest has `canUseOAuth` set to
// true.
connectSession: {
    path: '/pub.Publisher/ConnectSession',
    requestStream: false,
    responseStream: true,
    requestType: publisher_pb.ConnectRequest,
    responseType: publisher_pb.ConnectResponse,
    requestSerialize: serialize_ConnectRequest,
    requestDeserialize: deserialize_ConnectRequest,
    responseSerialize: serialize_ConnectResponse,
    responseDeserialize: deserialize_ConnectResponse,
  },
  // DiscoverShapes requests a listing of schemas this publisher can provide
// records for.
// 
// Deprecated: Deprecated in API version 2. Implement DiscoverSchemasStream
// instead.
discoverShapes: {
    path: '/pub.Publisher/DiscoverShapes',
    requestStream: false,
    responseStream: false,
    requestType: publisher_pb.DiscoverSchemasRequest,
    responseType: publisher_pb.DiscoverSchemasResponse,
    requestSerialize: serialize_DiscoverSchemasRequest,
    requestDeserialize: deserialize_DiscoverSchemasRequest,
    responseSerialize: serialize_DiscoverSchemasResponse,
    responseDeserialize: deserialize_DiscoverSchemasResponse,
  },
  // Requests a listing of schemas this publisher can provide records for.
// New plugins should implement DiscoverSchemaStream and stream discovered
// schemes to the caller.
// 
// Deprecated: Deprecated in API version 2. Implement DiscoverSchemasStream
// instead.
discoverSchemas: {
    path: '/pub.Publisher/DiscoverSchemas',
    requestStream: false,
    responseStream: false,
    requestType: publisher_pb.DiscoverSchemasRequest,
    responseType: publisher_pb.DiscoverSchemasResponse,
    requestSerialize: serialize_DiscoverSchemasRequest,
    requestDeserialize: deserialize_DiscoverSchemasRequest,
    responseSerialize: serialize_DiscoverSchemasResponse,
    responseDeserialize: deserialize_DiscoverSchemasResponse,
  },
  // Requests a stream of schemas this publisher can provide records for.
// 
// API Version: 3
discoverSchemasStream: {
    path: '/pub.Publisher/DiscoverSchemasStream',
    requestStream: false,
    responseStream: true,
    requestType: publisher_pb.DiscoverSchemasRequest,
    responseType: publisher_pb.Schema,
    requestSerialize: serialize_DiscoverSchemasRequest,
    requestDeserialize: deserialize_DiscoverSchemasRequest,
    responseSerialize: serialize_Schema,
    responseDeserialize: deserialize_Schema,
  },
  // PublishStream begins streaming records to the client from the plugin.
// Implement ReadStream instead.
// 
// Deprecated: Deprecated in API Version 2. Implement ReadStream instead.
publishStream: {
    path: '/pub.Publisher/PublishStream',
    requestStream: false,
    responseStream: true,
    requestType: publisher_pb.ReadRequest,
    responseType: publisher_pb.Record,
    requestSerialize: serialize_ReadRequest,
    requestDeserialize: deserialize_ReadRequest,
    responseSerialize: serialize_Record,
    responseDeserialize: deserialize_Record,
  },
  // ReadStream begins streaming records to the client from the plugin.
// API Version: 2
readStream: {
    path: '/pub.Publisher/ReadStream',
    requestStream: false,
    responseStream: true,
    requestType: publisher_pb.ReadRequest,
    responseType: publisher_pb.Record,
    requestSerialize: serialize_ReadRequest,
    requestDeserialize: deserialize_ReadRequest,
    responseSerialize: serialize_Record,
    responseDeserialize: deserialize_Record,
  },
  // Tells the plugin to disconnect from its data source, stop any running
// publishes, and gracefully prepare to be shut down.
disconnect: {
    path: '/pub.Publisher/Disconnect',
    requestStream: false,
    responseStream: false,
    requestType: publisher_pb.DisconnectRequest,
    responseType: publisher_pb.DisconnectResponse,
    requestSerialize: serialize_DisconnectRequest,
    requestDeserialize: deserialize_DisconnectRequest,
    responseSerialize: serialize_DisconnectResponse,
    responseDeserialize: deserialize_DisconnectResponse,
  },
  // Configures a connection which can be used to connect to a data source.
// This must be implemented if the plugin manifest has
// `canConfigureConnection` set to true. This is an alternative to having a
// `configSchema` element in the manifest.
configureConnection: {
    path: '/pub.Publisher/ConfigureConnection',
    requestStream: false,
    responseStream: false,
    requestType: publisher_pb.ConfigureConnectionRequest,
    responseType: publisher_pb.ConfigureConnectionResponse,
    requestSerialize: serialize_ConfigureConnectionRequest,
    requestDeserialize: deserialize_ConfigureConnectionRequest,
    responseSerialize: serialize_ConfigureConnectionResponse,
    responseDeserialize: deserialize_ConfigureConnectionResponse,
  },
  // Configures a query which can be used to publish a schema.
// This must be implemented if the plugin manifest has `canConfigureQuery` set
// to true.
configureQuery: {
    path: '/pub.Publisher/ConfigureQuery',
    requestStream: false,
    responseStream: false,
    requestType: publisher_pb.ConfigureQueryRequest,
    responseType: publisher_pb.ConfigureQueryResponse,
    requestSerialize: serialize_ConfigureQueryRequest,
    requestDeserialize: deserialize_ConfigureQueryRequest,
    responseSerialize: serialize_ConfigureQueryResponse,
    responseDeserialize: deserialize_ConfigureQueryResponse,
  },
  // Configures settings for real time publishing (change detection).
// This must be implemented if the plugin manifest has `canPublishRealTime`
// set to true.
configureRealTime: {
    path: '/pub.Publisher/ConfigureRealTime',
    requestStream: false,
    responseStream: false,
    requestType: publisher_pb.ConfigureRealTimeRequest,
    responseType: publisher_pb.ConfigureRealTimeResponse,
    requestSerialize: serialize_ConfigureRealTimeRequest,
    requestDeserialize: deserialize_ConfigureRealTimeRequest,
    responseSerialize: serialize_ConfigureRealTimeResponse,
    responseDeserialize: deserialize_ConfigureRealTimeResponse,
  },
  // Invoked to begin an OAuth flow. This must be implemented if the plugin
// manifest has `canUseOAuth` set to true.
beginOAuthFlow: {
    path: '/pub.Publisher/BeginOAuthFlow',
    requestStream: false,
    responseStream: false,
    requestType: publisher_pb.BeginOAuthFlowRequest,
    responseType: publisher_pb.BeginOAuthFlowResponse,
    requestSerialize: serialize_BeginOAuthFlowRequest,
    requestDeserialize: deserialize_BeginOAuthFlowRequest,
    responseSerialize: serialize_BeginOAuthFlowResponse,
    responseDeserialize: deserialize_BeginOAuthFlowResponse,
  },
  // Invoked to complete an OAuth flow. This must be implemented if the plugin
// manifest has `canUseOAuth` set to true.
completeOAuthFlow: {
    path: '/pub.Publisher/CompleteOAuthFlow',
    requestStream: false,
    responseStream: false,
    requestType: publisher_pb.CompleteOAuthFlowRequest,
    responseType: publisher_pb.CompleteOAuthFlowResponse,
    requestSerialize: serialize_CompleteOAuthFlowRequest,
    requestDeserialize: deserialize_CompleteOAuthFlowRequest,
    responseSerialize: serialize_CompleteOAuthFlowResponse,
    responseDeserialize: deserialize_CompleteOAuthFlowResponse,
  },
  // Configures a write back which can be used to write back a schema to the
// source. This must be implemented if the plugin manifest has
// `canConfigureWrite` set to true.
configureWrite: {
    path: '/pub.Publisher/ConfigureWrite',
    requestStream: false,
    responseStream: false,
    requestType: publisher_pb.ConfigureWriteRequest,
    responseType: publisher_pb.ConfigureWriteResponse,
    requestSerialize: serialize_ConfigureWriteRequest,
    requestDeserialize: deserialize_ConfigureWriteRequest,
    responseSerialize: serialize_ConfigureWriteResponse,
    responseDeserialize: deserialize_ConfigureWriteResponse,
  },
  // Configures a replication write back, where the plugin is in control
// of the destination and can insert/update/delete at will.
configureReplication: {
    path: '/pub.Publisher/ConfigureReplication',
    requestStream: false,
    responseStream: false,
    requestType: publisher_pb.ConfigureReplicationRequest,
    responseType: publisher_pb.ConfigureReplicationResponse,
    requestSerialize: serialize_ConfigureReplicationRequest,
    requestDeserialize: deserialize_ConfigureReplicationRequest,
    responseSerialize: serialize_ConfigureReplicationResponse,
    responseDeserialize: deserialize_ConfigureReplicationResponse,
  },
  // Invoked to begin a write back request
// This must be implemented if the manifest has `canWrite` set to true.
prepareWrite: {
    path: '/pub.Publisher/PrepareWrite',
    requestStream: false,
    responseStream: false,
    requestType: publisher_pb.PrepareWriteRequest,
    responseType: publisher_pb.PrepareWriteResponse,
    requestSerialize: serialize_PrepareWriteRequest,
    requestDeserialize: deserialize_PrepareWriteRequest,
    responseSerialize: serialize_PrepareWriteResponse,
    responseDeserialize: deserialize_PrepareWriteResponse,
  },
  // Creates a stream of records to write back and opens a stream to receive
// acks for write backs This must be implemented if the manifest has
// `canWrite` set to true.
writeStream: {
    path: '/pub.Publisher/WriteStream',
    requestStream: true,
    responseStream: true,
    requestType: publisher_pb.Record,
    responseType: publisher_pb.RecordAck,
    requestSerialize: serialize_Record,
    requestDeserialize: deserialize_Record,
    responseSerialize: serialize_RecordAck,
    responseDeserialize: deserialize_RecordAck,
  },
  // Requests a listing of all related entities.
discoverRelatedEntities: {
    path: '/pub.Publisher/DiscoverRelatedEntities',
    requestStream: false,
    responseStream: false,
    requestType: publisher_pb.DiscoverRelatedEntitiesRequest,
    responseType: publisher_pb.DiscoverRelatedEntitiesResponse,
    requestSerialize: serialize_DiscoverRelatedEntitiesRequest,
    requestDeserialize: deserialize_DiscoverRelatedEntitiesRequest,
    responseSerialize: serialize_DiscoverRelatedEntitiesResponse,
    responseDeserialize: deserialize_DiscoverRelatedEntitiesResponse,
  },
};

exports.PublisherClient = grpc.makeGenericClientConstructor(PublisherService);
