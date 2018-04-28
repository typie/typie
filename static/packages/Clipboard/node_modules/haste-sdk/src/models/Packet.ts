
export default class Packet {
    private command = "";
    private payload: object = {};
    constructor(command: string, payload?: object) {
        this.command = command;
        this.payload = payload ? payload : {};
    }
}
