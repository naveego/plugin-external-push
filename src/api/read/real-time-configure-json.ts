export const GetSchemaJson = () => JSON.stringify({
    "type": "object",
    "properties": {
        "channelName": {
        "type": "string",
        "title": "Channel name"
        }
    },
    "required": [
        "channelName"
    ]
});

export const GetUIJson = () => JSON.stringify({
    "ui:order": [
        "channelName"
    ]
});