import _ from "lodash";

export class RealTimeState {
    jobVersion: number = -1;
    shapeVersion: number = -1;
    lastReadTime: Date = new Date('0001-01-01Z00:00:00.000');

    toString = () => JSON.stringify({
        jobVersion: this.jobVersion,
        shapeVersion: this.shapeVersion,
        lastReadTime: this.lastReadTime.toISOString()
    });

    static fromJSONString = (json: string): RealTimeState => {
        let jsonObject = JSON.parse(json);
        let result = new RealTimeState();
        
        let jobVersion = jsonObject["jobVersion"];
        if (!_.isNumber(jobVersion)) throw new Error("jobVersion missing or invalid type");
        result.jobVersion = jobVersion;

        let shapeVersion = jsonObject["shapeVersion"];
        if (!_.isNumber(shapeVersion)) throw new Error("shapeVersion missing or invalid type");
        result.shapeVersion = shapeVersion;

        let lastReadTimeStr = jsonObject["lastReadTime"];
        if (!_.isString(lastReadTimeStr)) throw new Error("lastReadTime missing or invalid type");
        let lastReadTime = new Date(lastReadTimeStr);
        result.lastReadTime = lastReadTime;

        return result;
    };

    static tryParseJSON = (json: string): [Error | undefined, RealTimeState | undefined] => {
        try {
            return [undefined, RealTimeState.fromJSONString(json)];
        }
        catch (e: any) {
            if (_.isError(e)) return [e, undefined];
            else return [new Error(`${e}`), undefined];
        }
    };
}

export class RealTimeSettings {
    channelName: string = "";
    batchWindowSeconds: number = 5;

    toString = () => JSON.stringify({
        channelName: this.channelName,
        batchWindowSeconds: this.batchWindowSeconds
    });

    static fromJSONString = (json: string): RealTimeSettings => {
        let jsonObject = JSON.parse(json);
        let result = new RealTimeSettings();
        
        let batchWindowSeconds = jsonObject["batchWindowSeconds"];
        if (!_.isNumber(batchWindowSeconds)) throw new Error("batchWindowSeconds missing or invalid type");
        result.batchWindowSeconds = batchWindowSeconds;

        let channelName = jsonObject["channelName"];
        if (!_.isString(channelName)) throw new Error("channelName missing or invalid type");
        result.channelName = channelName;

        return result;
    };

    static tryParseJSON = (json: string): [Error | undefined, RealTimeState | undefined] => {
        try {
            return [undefined, RealTimeState.fromJSONString(json)];
        }
        catch (e: any) {
            if (_.isError(e)) return [e, undefined];
            else return [new Error(`${e}`), undefined];
        }
    };
}