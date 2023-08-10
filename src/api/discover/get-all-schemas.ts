import { Settings } from "../../helper/settings";
import { Logger } from "../../logger/logger";
import { Property, PropertyType, Schema } from "../../proto/publisher_pb";

export async function GetAllSchemas(logger: Logger, settings: Settings, sampleSize: number): Promise<Schema[]> {
    let schema: Schema = new Schema();
    schema.setId("external-push-schema"); // TODO: Update schema id & name
    schema.setName("External Push Schema"); 
    schema.setDataFlowDirection(Schema.DataFlowDirection.READ);
    
    let inputProperties = settings.inputSchema;
    inputProperties.forEach((inputProperty, i) => {
        let propertyToAdd = new Property();
        propertyToAdd.setId(inputProperty.propertyName);
        propertyToAdd.setName(inputProperty.propertyName);
        propertyToAdd.setIsKey(false);
        propertyToAdd.setIsNullable(true);
        propertyToAdd.setType(GetType(inputProperty.propertyType));
        propertyToAdd.setTypeAtSource(inputProperty.propertyType);

        schema.addProperties(propertyToAdd, i);
    });

    schema = await AddSampleAndCount(schema, sampleSize);
    
    return [schema];
}

export function GetType(dataType: string): PropertyType {
    switch (dataType) {
        case "String":
            return PropertyType.STRING;
        case "Integer":
            return PropertyType.INTEGER;
        case "Float":
            return PropertyType.FLOAT;
        case "Boolean":
            return PropertyType.BOOL;
        case "Date Time":
            return PropertyType.DATETIME;
        case "JSON":
            return PropertyType.TEXT;
        default:
            return PropertyType.STRING;
    }
}

export async function AddSampleAndCount(schema: Schema, sampleSize: number): Promise<Schema> {
    return schema; // TODO: Read records here & take sample size
}