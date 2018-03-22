const Go = require('gonode').Go;

export default class GoDispatcher
{
    private static go: any;
    public static listening: boolean = false;

    public static startListen() {
        console.log('Starting Haste Service');
        //GoDispatcher.go = new Go({path: "C:\\projects\\Go\\src\\haste\\main.go"});
        //GoDispatcher.go = new Go({path: "C:\\projects\\Go\\src\\haste\\haste.exe"});
        GoDispatcher.go = new Go({path: "static/bin/haste/haste"});
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