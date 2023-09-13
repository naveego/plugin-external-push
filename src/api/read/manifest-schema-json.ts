import * as fs from 'fs/promises';
import _ from 'lodash';
import path from 'path';
import { getAppRootDirectory } from '../../main';

async function getConfigSchemaElement(element: string): Promise<string | undefined> {
    try {
        // read from the manifest.json file
        let manifestPath = path.join(getAppRootDirectory(), 'manifest.json');
        const data = await fs.readFile(manifestPath, { encoding: 'utf8' });

        let targetElement = JSON.parse(data)?.['configSchema']?.[element];
        if (_.isNil(targetElement)) {
            return undefined;
        }
        return JSON.stringify(targetElement);
    }
    catch (error: any) {
        return undefined;
    }
}

export async function GetManifestSchemaJson(): Promise<string> {
    let schemaJson = await getConfigSchemaElement('schema');
    if (schemaJson === undefined) {
        throw new Error('Schema JSON not found');
    }

    return schemaJson;
}

export async function GetManifestUIJson(): Promise<string> {
    let schemaJson = await getConfigSchemaElement('ui');
    if (schemaJson === undefined) {
        throw new Error('UI JSON not found');
    }

    return schemaJson;
}