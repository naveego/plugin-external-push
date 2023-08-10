import _ from "lodash";

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

    if (settings.inputSchema.length <= 0) {
        throw new Error("At least one Input Schema Property must be defined");
    }

    let propertyNames = _.cloneDeep(settings.inputSchema.map(p => p.propertyName));
    settings.inputSchema.forEach((prop, i) => {
        // clear property name so that it isn't tripping duplicates check
        propertyNames[i] = "";

        if (!prop.propertyName) {
            throw new Error(`Input Schema: Property ${i+1} does not have a name`);
        }
        if (!prop.propertyType) {
            throw new Error(`Input Schema: Property \"${prop.propertyName}\" does not have a type`);
        }
        if (propertyNames.includes(prop.propertyName)) {
            throw new Error(`Input Schema: Found duplicate properties with name \"${prop.propertyName}\"`);
        }
    });

    if (settings.tokenValidationEndpoint) {
        let urlRegex = new RegExp(/^((https|http):\/\/)?(www.)?[a-z0-9]+(.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(?:[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/);
        if (!urlRegex.test(settings.tokenValidationEndpoint)) {
            throw new Error("Token validation endpoint is not a valid URL");
        }
    }

    return true;
}