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
        throw new Error("Port is undefined");
    }

    if (settings?.inputSchema.length <= 0) {
        throw new Error("At least one Input Schema Property must be defined");
    }

    if (settings.tokenValidationEndpoint) {
        let urlRegex = new RegExp(/^((https|http):\/\/)?(www.)?[a-z0-9]+(.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(?:[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/);
        if (!urlRegex.test(settings.tokenValidationEndpoint)) {
            throw new Error("Token validation endpoint is not a valid URL");
        }
    }

    return true;
}