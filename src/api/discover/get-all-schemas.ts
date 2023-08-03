import { Settings } from "../../helper/settings";
import { Logger } from "../../logger/logger";
import { Schema } from "../../proto/publisher_pb";

export async function GetAllSchemas(logger: Logger, settings: Settings, sampleSize: number): Promise<Schema[]> {
    let schemas: Schema[] = [];
    
    // TODO: build static schema based on settings
    
    return schemas;
}