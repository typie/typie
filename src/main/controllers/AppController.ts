import {app} from 'electron';
import MainWindowController from "./MainWindowController";
import GoDispatcher from "../services/GoDispatcher";
import PackageLoader from "../services/PackageLoader";
import HasteListener from "../listeners/HasteListener";
import Packet from "../models/Packet";

export default class AppController
{
    public static bootstrapApp(win: MainWindowController) {
        GoDispatcher.startListen();
        let bootstrap = setInterval(() => {
            if (GoDispatcher.listening) {
                clearInterval(bootstrap);
                new HasteListener(new PackageLoader());
            }
        }, 1);
        win.createWindow();
    }

    public static windowAllClosed() {
        // quit application when all windows are closed
        // on macOS it is common for applications to stay open until the user explicitly quits
        if (process.platform !== 'darwin') {
            AppController.quit()
        }
    }

    public static quit() {
        // GoDispatcher.send(new Packet('persist'))
        //     .then(res => {
        //         console.log('Quiting:',res);
        //         GoDispatcher.close();
        //         app.quit();
        //     });

        GoDispatcher.close();
        app.quit();
    }
}

