import { Settings } from '../../helper/settings';
import { Count, Property, PropertyType, Schema } from '../../proto/publisher_pb';

export async function GetAllSchemas(settings: Settings): Promise<Schema[]> {
    return new Promise((res, rej) => {
        try {
            let schema: Schema = new Schema()
                .setId('external-push-schema')
                .setName('External Push Schema')
                .setDataFlowDirection(Schema.DataFlowDirection.READ);

            let inputProperties = settings.inputSchema;
            inputProperties.forEach((inputProperty, i) => {
                let propertyToAdd = new Property()
                    .setId(inputProperty.propertyName)
                    .setName(inputProperty.propertyName)
                    .setDescription('')
                    .setIsKey(false)
                    .setIsNullable(true)
                    .setType(GetType(inputProperty.propertyType))
                    .setTypeAtSource(inputProperty.propertyType);

                schema.addProperties(propertyToAdd, i);
            });

            schema.setCount(new Count().setValue(0));
            res([schema]);
        }
        catch (err) { rej(err); }
    });
}

export function GetType(dataType: string): PropertyType {
    switch (dataType) {
        case 'String':
            return PropertyType.STRING;
        case 'Integer':
            return PropertyType.INTEGER;
        case 'Float':
            return PropertyType.FLOAT;
        case 'Boolean':
            return PropertyType.BOOL;
        case 'Date Time':
            return PropertyType.DATETIME;
        case 'JSON':
            return PropertyType.JSON;
        default:
            return PropertyType.STRING;
    }
}