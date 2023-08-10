export class RealTimeState {
    jobVersion: number = -1;
    shapeVersion: number = -1;
    lastReadTime: Date = new Date('0001-01-01Z00:00:00.000');

    toString = () => JSON.stringify({
        jobVersion: this.jobVersion,
        shapeVersion: this.shapeVersion,
        lastReadTime: this.lastReadTime
    });
}

export class RealTimeSettings {
    channelName: string = "";
    batchWindowSeconds: number = 5;

    toString = () => JSON.stringify({
        channelName: this.channelName,
        batchWindowSeconds: this.batchWindowSeconds
    });
}