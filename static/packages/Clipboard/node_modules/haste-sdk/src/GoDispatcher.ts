import {Go} from "gonode";
import Packet from "./models/Packet";
// import * as path from "path";

export default class GoDispatcher {

    public static go: any;
    public static listening: boolean;

    constructor(hasteExecutable: string) {
        console.log("Starting Haste Service", hasteExecutable);
        GoDispatcher.listening = false;
        GoDispatcher.go = new Go({
            defaultCommandTimeoutSec: 60,
            maxCommandsRunning: 10,
            path: hasteExecutable,
        });
        GoDispatcher.go.init(this.register);
    }

    public send(packet: Packet): Promise<any> {
        // console.log("send packet", packet);
        return new Promise((resolve, reject) => {
            GoDispatcher.go.execute(packet, (result: any, response: any) => {
                // console.log("got back", response);
                if (result.ok) {
                    if (response.data) {
                        response.data = JSON.parse(response.data);
                    }
                    return resolve(response);
                }
                return reject(response);
            });
        });
    }

    public close(): void {
        GoDispatcher.go.close();
        GoDispatcher.listening = false;
    }

    private register(): void {
        GoDispatcher.go.execute(
            {command: "start"}, (result: any, response: any) => {
                if (result.ok) {  // Check if response is ok
                    // In our case we just echo the command, so we can get our text back
                    console.log("Haste responded: ", response);
                    console.log("Haste err === 0: ", response.err === 0);
                    if (response.err === 0) {
                        GoDispatcher.listening = true;
                    }
                }
            });
    }
}
