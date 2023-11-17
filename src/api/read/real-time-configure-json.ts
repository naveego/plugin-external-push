export const GetSchemaJson = () => JSON.stringify({
    'type': 'object',
    'properties': {
        'channelName': {
            'type': 'string',
            'title': 'Channel name',
            'description': 'Used as an identifier to mark log messages associated with this Input. It is recommended to use a unique value for each Input.'
        }
    },
    'required': [
        'channelName'
    ]
});

export const GetUIJson = () => JSON.stringify({
    'ui:order': [
        'channelName'
    ]
});