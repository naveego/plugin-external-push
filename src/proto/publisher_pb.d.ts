// package: 
// file: publisher.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class DataVersions extends jspb.Message { 
    getJobId(): string;
    setJobId(value: string): DataVersions;
    getJobDataVersion(): number;
    setJobDataVersion(value: number): DataVersions;
    getShapeId(): string;
    setShapeId(value: string): DataVersions;
    getShapeDataVersion(): number;
    setShapeDataVersion(value: number): DataVersions;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DataVersions.AsObject;
    static toObject(includeInstance: boolean, msg: DataVersions): DataVersions.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DataVersions, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DataVersions;
    static deserializeBinaryFromReader(message: DataVersions, reader: jspb.BinaryReader): DataVersions;
}

export namespace DataVersions {
    export type AsObject = {
        jobId: string,
        jobDataVersion: number,
        shapeId: string,
        shapeDataVersion: number,
    }
}

export class ConfigureRequest extends jspb.Message { 
    getLogLevel(): LogLevel;
    setLogLevel(value: LogLevel): ConfigureRequest;
    getLogDirectory(): string;
    setLogDirectory(value: string): ConfigureRequest;
    getPermanentDirectory(): string;
    setPermanentDirectory(value: string): ConfigureRequest;
    getTemporaryDirectory(): string;
    setTemporaryDirectory(value: string): ConfigureRequest;

    hasDataVersions(): boolean;
    clearDataVersions(): void;
    getDataVersions(): DataVersions | undefined;
    setDataVersions(value?: DataVersions): ConfigureRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConfigureRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ConfigureRequest): ConfigureRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConfigureRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConfigureRequest;
    static deserializeBinaryFromReader(message: ConfigureRequest, reader: jspb.BinaryReader): ConfigureRequest;
}

export namespace ConfigureRequest {
    export type AsObject = {
        logLevel: LogLevel,
        logDirectory: string,
        permanentDirectory: string,
        temporaryDirectory: string,
        dataVersions?: DataVersions.AsObject,
    }
}

export class ConfigureResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConfigureResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ConfigureResponse): ConfigureResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConfigureResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConfigureResponse;
    static deserializeBinaryFromReader(message: ConfigureResponse, reader: jspb.BinaryReader): ConfigureResponse;
}

export namespace ConfigureResponse {
    export type AsObject = {
    }
}

export class ConnectRequest extends jspb.Message { 
    getSettingsJson(): string;
    setSettingsJson(value: string): ConnectRequest;

    hasOauthConfiguration(): boolean;
    clearOauthConfiguration(): void;
    getOauthConfiguration(): OAuthConfiguration | undefined;
    setOauthConfiguration(value?: OAuthConfiguration): ConnectRequest;
    getOauthStateJson(): string;
    setOauthStateJson(value: string): ConnectRequest;

    hasDataVersions(): boolean;
    clearDataVersions(): void;
    getDataVersions(): DataVersions | undefined;
    setDataVersions(value?: DataVersions): ConnectRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConnectRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ConnectRequest): ConnectRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConnectRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConnectRequest;
    static deserializeBinaryFromReader(message: ConnectRequest, reader: jspb.BinaryReader): ConnectRequest;
}

export namespace ConnectRequest {
    export type AsObject = {
        settingsJson: string,
        oauthConfiguration?: OAuthConfiguration.AsObject,
        oauthStateJson: string,
        dataVersions?: DataVersions.AsObject,
    }
}

export class ConnectResponse extends jspb.Message { 
    getSettingsError(): string;
    setSettingsError(value: string): ConnectResponse;
    getConnectionError(): string;
    setConnectionError(value: string): ConnectResponse;
    getOauthError(): string;
    setOauthError(value: string): ConnectResponse;
    getOauthStateJson(): string;
    setOauthStateJson(value: string): ConnectResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConnectResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ConnectResponse): ConnectResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConnectResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConnectResponse;
    static deserializeBinaryFromReader(message: ConnectResponse, reader: jspb.BinaryReader): ConnectResponse;
}

export namespace ConnectResponse {
    export type AsObject = {
        settingsError: string,
        connectionError: string,
        oauthError: string,
        oauthStateJson: string,
    }
}

export class ReadRequest extends jspb.Message { 

    hasSchema(): boolean;
    clearSchema(): void;
    getSchema(): Schema | undefined;
    setSchema(value?: Schema): ReadRequest;
    getLimit(): number;
    setLimit(value: number): ReadRequest;
    clearFiltersList(): void;
    getFiltersList(): Array<PublishFilter>;
    setFiltersList(value: Array<PublishFilter>): ReadRequest;
    addFilters(value?: PublishFilter, index?: number): PublishFilter;
    getRealTimeSettingsJson(): string;
    setRealTimeSettingsJson(value: string): ReadRequest;
    getRealTimeStateJson(): string;
    setRealTimeStateJson(value: string): ReadRequest;
    getJobId(): string;
    setJobId(value: string): ReadRequest;
    getDataVersion(): number;
    setDataVersion(value: number): ReadRequest;

    hasDataVersions(): boolean;
    clearDataVersions(): void;
    getDataVersions(): DataVersions | undefined;
    setDataVersions(value?: DataVersions): ReadRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ReadRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ReadRequest): ReadRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ReadRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ReadRequest;
    static deserializeBinaryFromReader(message: ReadRequest, reader: jspb.BinaryReader): ReadRequest;
}

export namespace ReadRequest {
    export type AsObject = {
        schema?: Schema.AsObject,
        limit: number,
        filtersList: Array<PublishFilter.AsObject>,
        realTimeSettingsJson: string,
        realTimeStateJson: string,
        jobId: string,
        dataVersion: number,
        dataVersions?: DataVersions.AsObject,
    }
}

export class PublishFilter extends jspb.Message { 
    getKind(): PublishFilter.Kind;
    setKind(value: PublishFilter.Kind): PublishFilter;
    getPropertyId(): string;
    setPropertyId(value: string): PublishFilter;
    getValue(): string;
    setValue(value: string): PublishFilter;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PublishFilter.AsObject;
    static toObject(includeInstance: boolean, msg: PublishFilter): PublishFilter.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PublishFilter, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PublishFilter;
    static deserializeBinaryFromReader(message: PublishFilter, reader: jspb.BinaryReader): PublishFilter;
}

export namespace PublishFilter {
    export type AsObject = {
        kind: PublishFilter.Kind,
        propertyId: string,
        value: string,
    }

    export enum Kind {
    EQUALS = 0,
    LESS_THAN = 1,
    GREATER_THAN = 2,
    }

}

export class DiscoverSchemasRequest extends jspb.Message { 
    getMode(): DiscoverSchemasRequest.Mode;
    setMode(value: DiscoverSchemasRequest.Mode): DiscoverSchemasRequest;
    clearToRefreshList(): void;
    getToRefreshList(): Array<Schema>;
    setToRefreshList(value: Array<Schema>): DiscoverSchemasRequest;
    addToRefresh(value?: Schema, index?: number): Schema;
    getSampleSize(): number;
    setSampleSize(value: number): DiscoverSchemasRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DiscoverSchemasRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DiscoverSchemasRequest): DiscoverSchemasRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DiscoverSchemasRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DiscoverSchemasRequest;
    static deserializeBinaryFromReader(message: DiscoverSchemasRequest, reader: jspb.BinaryReader): DiscoverSchemasRequest;
}

export namespace DiscoverSchemasRequest {
    export type AsObject = {
        mode: DiscoverSchemasRequest.Mode,
        toRefreshList: Array<Schema.AsObject>,
        sampleSize: number,
    }

    export enum Mode {
    ALL = 0,
    REFRESH = 1,
    }

}

export class DiscoverSchemasResponse extends jspb.Message { 
    clearSchemasList(): void;
    getSchemasList(): Array<Schema>;
    setSchemasList(value: Array<Schema>): DiscoverSchemasResponse;
    addSchemas(value?: Schema, index?: number): Schema;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DiscoverSchemasResponse.AsObject;
    static toObject(includeInstance: boolean, msg: DiscoverSchemasResponse): DiscoverSchemasResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DiscoverSchemasResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DiscoverSchemasResponse;
    static deserializeBinaryFromReader(message: DiscoverSchemasResponse, reader: jspb.BinaryReader): DiscoverSchemasResponse;
}

export namespace DiscoverSchemasResponse {
    export type AsObject = {
        schemasList: Array<Schema.AsObject>,
    }
}

export class Schema extends jspb.Message { 
    getId(): string;
    setId(value: string): Schema;
    getName(): string;
    setName(value: string): Schema;
    getDescription(): string;
    setDescription(value: string): Schema;
    clearPropertiesList(): void;
    getPropertiesList(): Array<Property>;
    setPropertiesList(value: Array<Property>): Schema;
    addProperties(value?: Property, index?: number): Property;

    hasCount(): boolean;
    clearCount(): void;
    getCount(): Count | undefined;
    setCount(value?: Count): Schema;
    clearSampleList(): void;
    getSampleList(): Array<Record>;
    setSampleList(value: Array<Record>): Schema;
    addSample(value?: Record, index?: number): Record;
    getQuery(): string;
    setQuery(value: string): Schema;
    getPublisherMetaJson(): string;
    setPublisherMetaJson(value: string): Schema;
    clearErrorsList(): void;
    getErrorsList(): Array<string>;
    setErrorsList(value: Array<string>): Schema;
    addErrors(value: string, index?: number): string;
    getDataFlowDirection(): Schema.DataFlowDirection;
    setDataFlowDirection(value: Schema.DataFlowDirection): Schema;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Schema.AsObject;
    static toObject(includeInstance: boolean, msg: Schema): Schema.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Schema, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Schema;
    static deserializeBinaryFromReader(message: Schema, reader: jspb.BinaryReader): Schema;
}

export namespace Schema {
    export type AsObject = {
        id: string,
        name: string,
        description: string,
        propertiesList: Array<Property.AsObject>,
        count?: Count.AsObject,
        sampleList: Array<Record.AsObject>,
        query: string,
        publisherMetaJson: string,
        errorsList: Array<string>,
        dataFlowDirection: Schema.DataFlowDirection,
    }

    export enum DataFlowDirection {
    READ = 0,
    WRITE = 1,
    READ_WRITE = 2,
    }

}

export class Count extends jspb.Message { 
    getKind(): Count.Kind;
    setKind(value: Count.Kind): Count;
    getValue(): number;
    setValue(value: number): Count;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Count.AsObject;
    static toObject(includeInstance: boolean, msg: Count): Count.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Count, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Count;
    static deserializeBinaryFromReader(message: Count, reader: jspb.BinaryReader): Count;
}

export namespace Count {
    export type AsObject = {
        kind: Count.Kind,
        value: number,
    }

    export enum Kind {
    UNAVAILABLE = 0,
    ESTIMATE = 1,
    EXACT = 2,
    }

}

export class Property extends jspb.Message { 
    getId(): string;
    setId(value: string): Property;
    getName(): string;
    setName(value: string): Property;
    getDescription(): string;
    setDescription(value: string): Property;
    getType(): PropertyType;
    setType(value: PropertyType): Property;
    getIsKey(): boolean;
    setIsKey(value: boolean): Property;
    getIsCreateCounter(): boolean;
    setIsCreateCounter(value: boolean): Property;
    getIsUpdateCounter(): boolean;
    setIsUpdateCounter(value: boolean): Property;
    getPublisherMetaJson(): string;
    setPublisherMetaJson(value: string): Property;
    getTypeAtSource(): string;
    setTypeAtSource(value: string): Property;
    getIsNullable(): boolean;
    setIsNullable(value: boolean): Property;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Property.AsObject;
    static toObject(includeInstance: boolean, msg: Property): Property.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Property, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Property;
    static deserializeBinaryFromReader(message: Property, reader: jspb.BinaryReader): Property;
}

export namespace Property {
    export type AsObject = {
        id: string,
        name: string,
        description: string,
        type: PropertyType,
        isKey: boolean,
        isCreateCounter: boolean,
        isUpdateCounter: boolean,
        publisherMetaJson: string,
        typeAtSource: string,
        isNullable: boolean,
    }
}

export class DisconnectRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DisconnectRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DisconnectRequest): DisconnectRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DisconnectRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DisconnectRequest;
    static deserializeBinaryFromReader(message: DisconnectRequest, reader: jspb.BinaryReader): DisconnectRequest;
}

export namespace DisconnectRequest {
    export type AsObject = {
    }
}

export class DisconnectResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DisconnectResponse.AsObject;
    static toObject(includeInstance: boolean, msg: DisconnectResponse): DisconnectResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DisconnectResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DisconnectResponse;
    static deserializeBinaryFromReader(message: DisconnectResponse, reader: jspb.BinaryReader): DisconnectResponse;
}

export namespace DisconnectResponse {
    export type AsObject = {
    }
}

export class Record extends jspb.Message { 
    getAction(): Record.Action;
    setAction(value: Record.Action): Record;
    getDataJson(): string;
    setDataJson(value: string): Record;
    getRealTimeStateJson(): string;
    setRealTimeStateJson(value: string): Record;
    getCause(): string;
    setCause(value: string): Record;
    getCorrelationId(): string;
    setCorrelationId(value: string): Record;
    getRecordId(): string;
    setRecordId(value: string): Record;
    clearVersionsList(): void;
    getVersionsList(): Array<RecordVersion>;
    setVersionsList(value: Array<RecordVersion>): Record;
    addVersions(value?: RecordVersion, index?: number): RecordVersion;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Record.AsObject;
    static toObject(includeInstance: boolean, msg: Record): Record.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Record, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Record;
    static deserializeBinaryFromReader(message: Record, reader: jspb.BinaryReader): Record;
}

export namespace Record {
    export type AsObject = {
        action: Record.Action,
        dataJson: string,
        realTimeStateJson: string,
        cause: string,
        correlationId: string,
        recordId: string,
        versionsList: Array<RecordVersion.AsObject>,
    }

    export enum Action {
    UPSERT = 0,
    INSERT = 1,
    UPDATE = 2,
    DELETE = 3,
    REAL_TIME_STATE_COMMIT = 4,
    }

}

export class RecordVersion extends jspb.Message { 
    getConnectionId(): string;
    setConnectionId(value: string): RecordVersion;
    getJobId(): string;
    setJobId(value: string): RecordVersion;
    getSchemaId(): string;
    setSchemaId(value: string): RecordVersion;
    getRecordId(): string;
    setRecordId(value: string): RecordVersion;
    getDataJson(): string;
    setDataJson(value: string): RecordVersion;
    getSchemaDataJson(): string;
    setSchemaDataJson(value: string): RecordVersion;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RecordVersion.AsObject;
    static toObject(includeInstance: boolean, msg: RecordVersion): RecordVersion.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RecordVersion, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RecordVersion;
    static deserializeBinaryFromReader(message: RecordVersion, reader: jspb.BinaryReader): RecordVersion;
}

export namespace RecordVersion {
    export type AsObject = {
        connectionId: string,
        jobId: string,
        schemaId: string,
        recordId: string,
        dataJson: string,
        schemaDataJson: string,
    }
}

export class ConfigureQueryRequest extends jspb.Message { 

    hasForm(): boolean;
    clearForm(): void;
    getForm(): ConfigurationFormRequest | undefined;
    setForm(value?: ConfigurationFormRequest): ConfigureQueryRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConfigureQueryRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ConfigureQueryRequest): ConfigureQueryRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConfigureQueryRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConfigureQueryRequest;
    static deserializeBinaryFromReader(message: ConfigureQueryRequest, reader: jspb.BinaryReader): ConfigureQueryRequest;
}

export namespace ConfigureQueryRequest {
    export type AsObject = {
        form?: ConfigurationFormRequest.AsObject,
    }
}

export class ConfigureQueryResponse extends jspb.Message { 

    hasForm(): boolean;
    clearForm(): void;
    getForm(): ConfigurationFormResponse | undefined;
    setForm(value?: ConfigurationFormResponse): ConfigureQueryResponse;

    hasSchema(): boolean;
    clearSchema(): void;
    getSchema(): Schema | undefined;
    setSchema(value?: Schema): ConfigureQueryResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConfigureQueryResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ConfigureQueryResponse): ConfigureQueryResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConfigureQueryResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConfigureQueryResponse;
    static deserializeBinaryFromReader(message: ConfigureQueryResponse, reader: jspb.BinaryReader): ConfigureQueryResponse;
}

export namespace ConfigureQueryResponse {
    export type AsObject = {
        form?: ConfigurationFormResponse.AsObject,
        schema?: Schema.AsObject,
    }
}

export class ConfigureConnectionRequest extends jspb.Message { 

    hasForm(): boolean;
    clearForm(): void;
    getForm(): ConfigurationFormRequest | undefined;
    setForm(value?: ConfigurationFormRequest): ConfigureConnectionRequest;

    hasConnectRequest(): boolean;
    clearConnectRequest(): void;
    getConnectRequest(): ConnectRequest | undefined;
    setConnectRequest(value?: ConnectRequest): ConfigureConnectionRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConfigureConnectionRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ConfigureConnectionRequest): ConfigureConnectionRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConfigureConnectionRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConfigureConnectionRequest;
    static deserializeBinaryFromReader(message: ConfigureConnectionRequest, reader: jspb.BinaryReader): ConfigureConnectionRequest;
}

export namespace ConfigureConnectionRequest {
    export type AsObject = {
        form?: ConfigurationFormRequest.AsObject,
        connectRequest?: ConnectRequest.AsObject,
    }
}

export class ConfigureConnectionResponse extends jspb.Message { 

    hasForm(): boolean;
    clearForm(): void;
    getForm(): ConfigurationFormResponse | undefined;
    setForm(value?: ConfigurationFormResponse): ConfigureConnectionResponse;

    hasConnectResponse(): boolean;
    clearConnectResponse(): void;
    getConnectResponse(): ConnectResponse | undefined;
    setConnectResponse(value?: ConnectResponse): ConfigureConnectionResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConfigureConnectionResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ConfigureConnectionResponse): ConfigureConnectionResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConfigureConnectionResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConfigureConnectionResponse;
    static deserializeBinaryFromReader(message: ConfigureConnectionResponse, reader: jspb.BinaryReader): ConfigureConnectionResponse;
}

export namespace ConfigureConnectionResponse {
    export type AsObject = {
        form?: ConfigurationFormResponse.AsObject,
        connectResponse?: ConnectResponse.AsObject,
    }
}

export class ConfigureRealTimeRequest extends jspb.Message { 

    hasForm(): boolean;
    clearForm(): void;
    getForm(): ConfigurationFormRequest | undefined;
    setForm(value?: ConfigurationFormRequest): ConfigureRealTimeRequest;

    hasSchema(): boolean;
    clearSchema(): void;
    getSchema(): Schema | undefined;
    setSchema(value?: Schema): ConfigureRealTimeRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConfigureRealTimeRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ConfigureRealTimeRequest): ConfigureRealTimeRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConfigureRealTimeRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConfigureRealTimeRequest;
    static deserializeBinaryFromReader(message: ConfigureRealTimeRequest, reader: jspb.BinaryReader): ConfigureRealTimeRequest;
}

export namespace ConfigureRealTimeRequest {
    export type AsObject = {
        form?: ConfigurationFormRequest.AsObject,
        schema?: Schema.AsObject,
    }
}

export class ConfigureRealTimeResponse extends jspb.Message { 

    hasForm(): boolean;
    clearForm(): void;
    getForm(): ConfigurationFormResponse | undefined;
    setForm(value?: ConfigurationFormResponse): ConfigureRealTimeResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConfigureRealTimeResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ConfigureRealTimeResponse): ConfigureRealTimeResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConfigureRealTimeResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConfigureRealTimeResponse;
    static deserializeBinaryFromReader(message: ConfigureRealTimeResponse, reader: jspb.BinaryReader): ConfigureRealTimeResponse;
}

export namespace ConfigureRealTimeResponse {
    export type AsObject = {
        form?: ConfigurationFormResponse.AsObject,
    }
}

export class ConfigurationFormRequest extends jspb.Message { 
    getDataJson(): string;
    setDataJson(value: string): ConfigurationFormRequest;
    getStateJson(): string;
    setStateJson(value: string): ConfigurationFormRequest;
    getIsSave(): boolean;
    setIsSave(value: boolean): ConfigurationFormRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConfigurationFormRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ConfigurationFormRequest): ConfigurationFormRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConfigurationFormRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConfigurationFormRequest;
    static deserializeBinaryFromReader(message: ConfigurationFormRequest, reader: jspb.BinaryReader): ConfigurationFormRequest;
}

export namespace ConfigurationFormRequest {
    export type AsObject = {
        dataJson: string,
        stateJson: string,
        isSave: boolean,
    }
}

export class ConfigurationFormResponse extends jspb.Message { 
    getSchemaJson(): string;
    setSchemaJson(value: string): ConfigurationFormResponse;
    getUiJson(): string;
    setUiJson(value: string): ConfigurationFormResponse;
    getStateJson(): string;
    setStateJson(value: string): ConfigurationFormResponse;
    getDataJson(): string;
    setDataJson(value: string): ConfigurationFormResponse;
    getDataErrorsJson(): string;
    setDataErrorsJson(value: string): ConfigurationFormResponse;
    clearErrorsList(): void;
    getErrorsList(): Array<string>;
    setErrorsList(value: Array<string>): ConfigurationFormResponse;
    addErrors(value: string, index?: number): string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConfigurationFormResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ConfigurationFormResponse): ConfigurationFormResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConfigurationFormResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConfigurationFormResponse;
    static deserializeBinaryFromReader(message: ConfigurationFormResponse, reader: jspb.BinaryReader): ConfigurationFormResponse;
}

export namespace ConfigurationFormResponse {
    export type AsObject = {
        schemaJson: string,
        uiJson: string,
        stateJson: string,
        dataJson: string,
        dataErrorsJson: string,
        errorsList: Array<string>,
    }
}

export class BeginOAuthFlowRequest extends jspb.Message { 

    hasConfiguration(): boolean;
    clearConfiguration(): void;
    getConfiguration(): OAuthConfiguration | undefined;
    setConfiguration(value?: OAuthConfiguration): BeginOAuthFlowRequest;
    getRedirectUrl(): string;
    setRedirectUrl(value: string): BeginOAuthFlowRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BeginOAuthFlowRequest.AsObject;
    static toObject(includeInstance: boolean, msg: BeginOAuthFlowRequest): BeginOAuthFlowRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BeginOAuthFlowRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BeginOAuthFlowRequest;
    static deserializeBinaryFromReader(message: BeginOAuthFlowRequest, reader: jspb.BinaryReader): BeginOAuthFlowRequest;
}

export namespace BeginOAuthFlowRequest {
    export type AsObject = {
        configuration?: OAuthConfiguration.AsObject,
        redirectUrl: string,
    }
}

export class BeginOAuthFlowResponse extends jspb.Message { 
    getAuthorizationUrl(): string;
    setAuthorizationUrl(value: string): BeginOAuthFlowResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BeginOAuthFlowResponse.AsObject;
    static toObject(includeInstance: boolean, msg: BeginOAuthFlowResponse): BeginOAuthFlowResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BeginOAuthFlowResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BeginOAuthFlowResponse;
    static deserializeBinaryFromReader(message: BeginOAuthFlowResponse, reader: jspb.BinaryReader): BeginOAuthFlowResponse;
}

export namespace BeginOAuthFlowResponse {
    export type AsObject = {
        authorizationUrl: string,
    }
}

export class CompleteOAuthFlowRequest extends jspb.Message { 

    hasConfiguration(): boolean;
    clearConfiguration(): void;
    getConfiguration(): OAuthConfiguration | undefined;
    setConfiguration(value?: OAuthConfiguration): CompleteOAuthFlowRequest;
    getRedirectUrl(): string;
    setRedirectUrl(value: string): CompleteOAuthFlowRequest;
    getRedirectBody(): string;
    setRedirectBody(value: string): CompleteOAuthFlowRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CompleteOAuthFlowRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CompleteOAuthFlowRequest): CompleteOAuthFlowRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CompleteOAuthFlowRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CompleteOAuthFlowRequest;
    static deserializeBinaryFromReader(message: CompleteOAuthFlowRequest, reader: jspb.BinaryReader): CompleteOAuthFlowRequest;
}

export namespace CompleteOAuthFlowRequest {
    export type AsObject = {
        configuration?: OAuthConfiguration.AsObject,
        redirectUrl: string,
        redirectBody: string,
    }
}

export class OAuthConfiguration extends jspb.Message { 
    getClientId(): string;
    setClientId(value: string): OAuthConfiguration;
    getClientSecret(): string;
    setClientSecret(value: string): OAuthConfiguration;
    getConfigurationJson(): string;
    setConfigurationJson(value: string): OAuthConfiguration;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OAuthConfiguration.AsObject;
    static toObject(includeInstance: boolean, msg: OAuthConfiguration): OAuthConfiguration.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: OAuthConfiguration, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): OAuthConfiguration;
    static deserializeBinaryFromReader(message: OAuthConfiguration, reader: jspb.BinaryReader): OAuthConfiguration;
}

export namespace OAuthConfiguration {
    export type AsObject = {
        clientId: string,
        clientSecret: string,
        configurationJson: string,
    }
}

export class CompleteOAuthFlowResponse extends jspb.Message { 
    getOauthStateJson(): string;
    setOauthStateJson(value: string): CompleteOAuthFlowResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CompleteOAuthFlowResponse.AsObject;
    static toObject(includeInstance: boolean, msg: CompleteOAuthFlowResponse): CompleteOAuthFlowResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CompleteOAuthFlowResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CompleteOAuthFlowResponse;
    static deserializeBinaryFromReader(message: CompleteOAuthFlowResponse, reader: jspb.BinaryReader): CompleteOAuthFlowResponse;
}

export namespace CompleteOAuthFlowResponse {
    export type AsObject = {
        oauthStateJson: string,
    }
}

export class ConfigureWriteRequest extends jspb.Message { 

    hasForm(): boolean;
    clearForm(): void;
    getForm(): ConfigurationFormRequest | undefined;
    setForm(value?: ConfigurationFormRequest): ConfigureWriteRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConfigureWriteRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ConfigureWriteRequest): ConfigureWriteRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConfigureWriteRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConfigureWriteRequest;
    static deserializeBinaryFromReader(message: ConfigureWriteRequest, reader: jspb.BinaryReader): ConfigureWriteRequest;
}

export namespace ConfigureWriteRequest {
    export type AsObject = {
        form?: ConfigurationFormRequest.AsObject,
    }
}

export class ConfigureWriteResponse extends jspb.Message { 

    hasForm(): boolean;
    clearForm(): void;
    getForm(): ConfigurationFormResponse | undefined;
    setForm(value?: ConfigurationFormResponse): ConfigureWriteResponse;

    hasSchema(): boolean;
    clearSchema(): void;
    getSchema(): Schema | undefined;
    setSchema(value?: Schema): ConfigureWriteResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConfigureWriteResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ConfigureWriteResponse): ConfigureWriteResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConfigureWriteResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConfigureWriteResponse;
    static deserializeBinaryFromReader(message: ConfigureWriteResponse, reader: jspb.BinaryReader): ConfigureWriteResponse;
}

export namespace ConfigureWriteResponse {
    export type AsObject = {
        form?: ConfigurationFormResponse.AsObject,
        schema?: Schema.AsObject,
    }
}

export class ConfigureReplicationRequest extends jspb.Message { 

    hasForm(): boolean;
    clearForm(): void;
    getForm(): ConfigurationFormRequest | undefined;
    setForm(value?: ConfigurationFormRequest): ConfigureReplicationRequest;

    hasSchema(): boolean;
    clearSchema(): void;
    getSchema(): Schema | undefined;
    setSchema(value?: Schema): ConfigureReplicationRequest;
    clearVersionsList(): void;
    getVersionsList(): Array<ReplicationWriteVersion>;
    setVersionsList(value: Array<ReplicationWriteVersion>): ConfigureReplicationRequest;
    addVersions(value?: ReplicationWriteVersion, index?: number): ReplicationWriteVersion;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConfigureReplicationRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ConfigureReplicationRequest): ConfigureReplicationRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConfigureReplicationRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConfigureReplicationRequest;
    static deserializeBinaryFromReader(message: ConfigureReplicationRequest, reader: jspb.BinaryReader): ConfigureReplicationRequest;
}

export namespace ConfigureReplicationRequest {
    export type AsObject = {
        form?: ConfigurationFormRequest.AsObject,
        schema?: Schema.AsObject,
        versionsList: Array<ReplicationWriteVersion.AsObject>,
    }
}

export class ConfigureReplicationResponse extends jspb.Message { 

    hasForm(): boolean;
    clearForm(): void;
    getForm(): ConfigurationFormResponse | undefined;
    setForm(value?: ConfigurationFormResponse): ConfigureReplicationResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConfigureReplicationResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ConfigureReplicationResponse): ConfigureReplicationResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConfigureReplicationResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConfigureReplicationResponse;
    static deserializeBinaryFromReader(message: ConfigureReplicationResponse, reader: jspb.BinaryReader): ConfigureReplicationResponse;
}

export namespace ConfigureReplicationResponse {
    export type AsObject = {
        form?: ConfigurationFormResponse.AsObject,
    }
}

export class PrepareWriteRequest extends jspb.Message { 
    getCommitSlaSeconds(): number;
    setCommitSlaSeconds(value: number): PrepareWriteRequest;

    hasSchema(): boolean;
    clearSchema(): void;
    getSchema(): Schema | undefined;
    setSchema(value?: Schema): PrepareWriteRequest;

    hasReplication(): boolean;
    clearReplication(): void;
    getReplication(): ReplicationWriteRequest | undefined;
    setReplication(value?: ReplicationWriteRequest): PrepareWriteRequest;

    hasDataVersions(): boolean;
    clearDataVersions(): void;
    getDataVersions(): DataVersions | undefined;
    setDataVersions(value?: DataVersions): PrepareWriteRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PrepareWriteRequest.AsObject;
    static toObject(includeInstance: boolean, msg: PrepareWriteRequest): PrepareWriteRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PrepareWriteRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PrepareWriteRequest;
    static deserializeBinaryFromReader(message: PrepareWriteRequest, reader: jspb.BinaryReader): PrepareWriteRequest;
}

export namespace PrepareWriteRequest {
    export type AsObject = {
        commitSlaSeconds: number,
        schema?: Schema.AsObject,
        replication?: ReplicationWriteRequest.AsObject,
        dataVersions?: DataVersions.AsObject,
    }
}

export class ReplicationWriteRequest extends jspb.Message { 
    clearVersionsList(): void;
    getVersionsList(): Array<ReplicationWriteVersion>;
    setVersionsList(value: Array<ReplicationWriteVersion>): ReplicationWriteRequest;
    addVersions(value?: ReplicationWriteVersion, index?: number): ReplicationWriteVersion;
    getSettingsJson(): string;
    setSettingsJson(value: string): ReplicationWriteRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ReplicationWriteRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ReplicationWriteRequest): ReplicationWriteRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ReplicationWriteRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ReplicationWriteRequest;
    static deserializeBinaryFromReader(message: ReplicationWriteRequest, reader: jspb.BinaryReader): ReplicationWriteRequest;
}

export namespace ReplicationWriteRequest {
    export type AsObject = {
        versionsList: Array<ReplicationWriteVersion.AsObject>,
        settingsJson: string,
    }
}

export class ReplicationWriteVersion extends jspb.Message { 
    getConnectionId(): string;
    setConnectionId(value: string): ReplicationWriteVersion;
    getConnectionName(): string;
    setConnectionName(value: string): ReplicationWriteVersion;
    getJobId(): string;
    setJobId(value: string): ReplicationWriteVersion;
    getJobName(): string;
    setJobName(value: string): ReplicationWriteVersion;
    getSchemaId(): string;
    setSchemaId(value: string): ReplicationWriteVersion;
    getSchemaName(): string;
    setSchemaName(value: string): ReplicationWriteVersion;

    getCapturedSchemaDataPropertiesMap(): jspb.Map<string, PropertyType>;
    clearCapturedSchemaDataPropertiesMap(): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ReplicationWriteVersion.AsObject;
    static toObject(includeInstance: boolean, msg: ReplicationWriteVersion): ReplicationWriteVersion.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ReplicationWriteVersion, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ReplicationWriteVersion;
    static deserializeBinaryFromReader(message: ReplicationWriteVersion, reader: jspb.BinaryReader): ReplicationWriteVersion;
}

export namespace ReplicationWriteVersion {
    export type AsObject = {
        connectionId: string,
        connectionName: string,
        jobId: string,
        jobName: string,
        schemaId: string,
        schemaName: string,

        capturedSchemaDataPropertiesMap: Array<[string, PropertyType]>,
    }
}

export class PrepareWriteResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PrepareWriteResponse.AsObject;
    static toObject(includeInstance: boolean, msg: PrepareWriteResponse): PrepareWriteResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PrepareWriteResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PrepareWriteResponse;
    static deserializeBinaryFromReader(message: PrepareWriteResponse, reader: jspb.BinaryReader): PrepareWriteResponse;
}

export namespace PrepareWriteResponse {
    export type AsObject = {
    }
}

export class RecordAck extends jspb.Message { 
    getCorrelationId(): string;
    setCorrelationId(value: string): RecordAck;
    getError(): string;
    setError(value: string): RecordAck;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RecordAck.AsObject;
    static toObject(includeInstance: boolean, msg: RecordAck): RecordAck.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RecordAck, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RecordAck;
    static deserializeBinaryFromReader(message: RecordAck, reader: jspb.BinaryReader): RecordAck;
}

export namespace RecordAck {
    export type AsObject = {
        correlationId: string,
        error: string,
    }
}

export class DiscoverRelatedEntitiesRequest extends jspb.Message { 
    clearToRelateList(): void;
    getToRelateList(): Array<Schema>;
    setToRelateList(value: Array<Schema>): DiscoverRelatedEntitiesRequest;
    addToRelate(value?: Schema, index?: number): Schema;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DiscoverRelatedEntitiesRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DiscoverRelatedEntitiesRequest): DiscoverRelatedEntitiesRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DiscoverRelatedEntitiesRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DiscoverRelatedEntitiesRequest;
    static deserializeBinaryFromReader(message: DiscoverRelatedEntitiesRequest, reader: jspb.BinaryReader): DiscoverRelatedEntitiesRequest;
}

export namespace DiscoverRelatedEntitiesRequest {
    export type AsObject = {
        toRelateList: Array<Schema.AsObject>,
    }
}

export class DiscoverRelatedEntitiesResponse extends jspb.Message { 
    clearRelatedEntitiesList(): void;
    getRelatedEntitiesList(): Array<RelatedEntity>;
    setRelatedEntitiesList(value: Array<RelatedEntity>): DiscoverRelatedEntitiesResponse;
    addRelatedEntities(value?: RelatedEntity, index?: number): RelatedEntity;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DiscoverRelatedEntitiesResponse.AsObject;
    static toObject(includeInstance: boolean, msg: DiscoverRelatedEntitiesResponse): DiscoverRelatedEntitiesResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DiscoverRelatedEntitiesResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DiscoverRelatedEntitiesResponse;
    static deserializeBinaryFromReader(message: DiscoverRelatedEntitiesResponse, reader: jspb.BinaryReader): DiscoverRelatedEntitiesResponse;
}

export namespace DiscoverRelatedEntitiesResponse {
    export type AsObject = {
        relatedEntitiesList: Array<RelatedEntity.AsObject>,
    }
}

export class RelatedEntity extends jspb.Message { 
    getSchemaId(): string;
    setSchemaId(value: string): RelatedEntity;
    getSourceResource(): string;
    setSourceResource(value: string): RelatedEntity;
    getSourceColumn(): string;
    setSourceColumn(value: string): RelatedEntity;
    getForeignResource(): string;
    setForeignResource(value: string): RelatedEntity;
    getForeignColumn(): string;
    setForeignColumn(value: string): RelatedEntity;
    getRelationshipName(): string;
    setRelationshipName(value: string): RelatedEntity;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RelatedEntity.AsObject;
    static toObject(includeInstance: boolean, msg: RelatedEntity): RelatedEntity.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RelatedEntity, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RelatedEntity;
    static deserializeBinaryFromReader(message: RelatedEntity, reader: jspb.BinaryReader): RelatedEntity;
}

export namespace RelatedEntity {
    export type AsObject = {
        schemaId: string,
        sourceResource: string,
        sourceColumn: string,
        foreignResource: string,
        foreignColumn: string,
        relationshipName: string,
    }
}

export enum LogLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3,
    TRACE = 4,
}

export enum PropertyType {
    STRING = 0,
    BOOL = 2,
    INTEGER = 3,
    FLOAT = 4,
    DECIMAL = 5,
    DATE = 6,
    TIME = 7,
    DATETIME = 8,
    TEXT = 9,
    BLOB = 10,
    JSON = 11,
    XML = 12,
}
