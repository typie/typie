import {Go} from "gonode";
import Packet from "./models/Packet";
// import * as path from "path";

export default class GoDispatcher {

    public static go: any;
    public static listening: boolean;
    private static executablePath: string;

    constructor(hasteExecutable: string) {
        console.log("Starting Haste Service for the first time", hasteExecutable);
        GoDispatcher.executablePath = hasteExecutable;
        this.startProcess();
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

    private startProcess(): void {
        console.log("Starting Haste Service", GoDispatcher.executablePath);
        GoDispatcher.listening = false;
        GoDispatcher.go = new Go({
            defaultCommandTimeoutSec: 60,
            maxCommandsRunning: 10,
            path: GoDispatcher.executablePath,
        });
        GoDispatcher.go.init(this.register);
        GoDispatcher.go.on("close", () => this.onClose());
        GoDispatcher.go.on("error", err => console.error("go dispatcher had error", err));
        // setTimeout(() => GoDispatcher.go.terminate(), 10000);
    }

    private onClose(): void {
        console.log("go dispatcher was closed");
        if (GoDispatcher.listening) {
            this.startProcess();
        }
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
