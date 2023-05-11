import {EventEmitter} from "events";
import {Go} from "typie-go";
import AppGlobal from "./AppGlobal";
import Packet from "./models/Packet";
// import * as path from "path";
const appGlobal: any = global;

export default class GoDispatcher {

    public static go: any;
    public static listening: boolean;
    public static emitter: EventEmitter;
    private static executablePath: string;

    constructor(typieExecutable: string) {
        console.info("Starting Typie Service for the first time", typieExecutable);
        GoDispatcher.executablePath = typieExecutable;
        GoDispatcher.emitter = new EventEmitter();
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
        console.info("Starting Typie Service", GoDispatcher.executablePath);
        GoDispatcher.listening = false;
        GoDispatcher.go = new Go({
            defaultCommandTimeoutSec: 60,
            maxCommandsRunning: 10,
            path: GoDispatcher.executablePath,
            persistDir: AppGlobal.paths().getUserDataPath(),
        });
        GoDispatcher.go.init(this.register);
        GoDispatcher.go.on("close", () => this.onClose());
        GoDispatcher.go.on("error", err => {
            console.error("go dispatcher had error", err.data.toString());
        });
        // setTimeout(() => GoDispatcher.go.terminate(), 10000);
    }

    private onClose(): void {
        console.info("go dispatcher was closed");
        if (GoDispatcher.listening) {
            this.startProcess();
        }
    }

    private register(): void {
        GoDispatcher.go.execute(
            {command: "start"}, (result: any, response: any) => {
                if (result.ok) {  // Check if response is ok
                    // In our case we just echo the command, so we can get our text back
                    console.info("Typie responded: ", response.msg);
                    appGlobal.coreLogPath = response.log;
                    if (response.err === 0) {
                        GoDispatcher.listening = true;
                        GoDispatcher.emitter.emit("typieServiceListening");
                    }
                }
            });
    }
}
