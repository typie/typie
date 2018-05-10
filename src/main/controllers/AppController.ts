declare const __static: any;
import {app, globalShortcut} from "electron";
import is from "electron-is";
import {GoDispatcher} from "haste-sdk";
import Path from "path";
import AppGlobal from "../helpers/AppGlobal";
import HasteListener from "../listeners/HasteListener";
import PackageLoader from "../services/PackageLoader";
import ConfigLoader from "../services/ConfigLoader";
import MainWindowController from "./MainWindowController";

let goDispatchPath;
if (is.windows()) {
    goDispatchPath = Path.join(__static, "bin/haste_go.exe");
} else if (is.osx()) {
    goDispatchPath = Path.join(__static, "bin/haste_go");
}

export default class AppController {

    public static bootstrapApp(win: MainWindowController, config: ConfigLoader) {
        win.createWindow();
        AppController.goDispatcher = new GoDispatcher(goDispatchPath);
        const bootstrap = setInterval(() => {
            if (GoDispatcher.listening && win.isExist) {
                clearInterval(bootstrap);
                AppGlobal.setGlobal("GoDispatcher", AppController.goDispatcher);
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
        globalShortcut.unregisterAll();
        if (AppController.goDispatcher && AppController.goDispatcher.hasOwnProperty("close")) {
            AppController.goDispatcher.close();
        }
        app.quit();
    }

    private static goDispatcher: GoDispatcher;
    private static hasteListener: HasteListener;
}
