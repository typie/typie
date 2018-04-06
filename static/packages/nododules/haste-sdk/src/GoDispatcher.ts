import {Go} from 'gonode';
import * as path from 'path';

export default class GoDispatcher
{
    private static go: any;
    public static listening: boolean = false;

    public static startListen() {
        console.log('Starting Haste Service');
        //GoDispatcher.go = new Go({path: "C:\\projects\\Go\\src\\haste\\main.go"});
        GoDispatcher.go = new Go({
            path: "C:\\projects\\Go\\src\\haste\\haste.exe",
            //path: path.normalize("/Users/rotemgrimberg/go/src/haste-go/haste-go"),
            defaultCommandTimeoutSec: 60,
            maxCommandsRunning: 10,
        });
        //GoDispatcher.go = new Go({path: "static/bin/haste/haste-go"});
        //GoDispatcher.go = new Go({path: path.normalize("/Users/rotemgrimberg/go/src/haste-go/haste-go")});
        GoDispatcher.go.init(this.register) // We must always initialize gonode before executing any commands
    }

    public static send(packet: any) {
        //let sendTime = Date.now();
        //console.log('packet', packet);
        return new Promise((resolve, reject) => {
            GoDispatcher.go.execute(packet, (result: any, response: any) => {
                //console.log('got back', response);
                if (result.ok) {
                    //console.log('golang time: ', Date.now() - sendTime);
                    if (response.data) {
                        response.data = JSON.parse(response.data);
                    }
                    return resolve(response);
                }
                return reject(response);
            });
        });
    }

    public static close() {
        GoDispatcher.go.close();
        GoDispatcher.listening = false;
    }

    private static register(): any {
        GoDispatcher.go.execute({command: 'start'}, (result: any, response: any) => {
            if (result.ok) { // Check if response is ok
                // In our case we just echo the command, so we can get our text back
                console.log('Haste responded: ', response);
                if (response.err == 0) {
                    GoDispatcher.listening = true;
                }
            }
        });
    }
}
