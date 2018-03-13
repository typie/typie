import { resolve } from "url";

//import * as Go from 'gonode';
const Go = require('gonode').Go;

export default class GoDispatcher
{
    private static go: any;

    public static startListen() {
        console.log('start GO service');
        GoDispatcher.go = new Go({path: "C:\\projects\\Go\\src\\haste\\main.go"});
        GoDispatcher.go.init(this.register) // We must always initialize gonode before executing any commands
    }

    public static send(packet: any) {
        return new Promise((resolve, reject) => {
            GoDispatcher.go.execute(packet, (result: any, response: any) => {
                if (result.ok) {
                   return resolve(response);
                }
                return reject(response);
            });
        });
    }

    private static register(): any {
        GoDispatcher.go.execute({text: 'listening'}, (result: any, response: any) => {
            if (result.ok) { // Check if response is ok
                // In our case we just echo the command, so we can get our text back
                console.log('Go responded: ' + response.text);
            }
        });
    }
}