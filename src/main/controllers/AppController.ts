import {app} from "electron";
import {GoDispatcher} from "haste-sdk";
import HasteListener from "../listeners/HasteListener";
import PackageLoader from "../services/PackageLoader";
import Settings from "../services/Settings";
import MainWindowController from "./MainWindowController";

export default class AppController {

    public static bootstrapApp(win: MainWindowController, config: Settings) {
        win.createWindow();
        GoDispatcher.startListen();
        const bootstrap = setInterval(() => {
            if (GoDispatcher.listening && win.isExist) {
                clearInterval(bootstrap);
                AppController.hasteListener = new HasteListener(new PackageLoader(win, config));
            }
        }, 1);
    }

    public static windowAllClosed() {
        // quit application when all windows are closed
        // on macOS it is common for applications to stay open until the user explicitly quits
        if (process.platform !== "darwin") {
            AppController.quit();
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

    private static hasteListener: HasteListener;
}
