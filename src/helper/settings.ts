export interface Settings {
    port: number;
    tokenValidationEndpoint: string;
    inputSchema: InputSchemaProperty[];
}

export interface InputSchemaProperty {
    propertyName: string;
    propertyType: string;
}

export function ValidateSettings(settings: Settings): boolean {
    if (!settings.port) {
        throw Error("Port is undefined");
    }

    if (settings?.inputSchema.length <= 0) {
        throw Error("At least one Input Schema Property must be defined");
    }

    if (settings.tokenValidationEndpoint) {
        // TODO: check if token validation endpoint is a valid one
    }

    return true;
}