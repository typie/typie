import {app, globalShortcut} from "electron";
import {AppGlobal, GoDispatcher, Packet} from "typie-sdk";
import TypieListener from "../listeners/TypieListener";
import PackageLoader from "../services/PackageLoader";
import ConfigLoader from "../services/ConfigLoader";
import MainWindowController from "./MainWindowController";

export default class AppController {

    public static persisted: boolean = false;
    public static allowQuit: boolean = false;

    public static bootstrapApp(win: MainWindowController, config: ConfigLoader) {
        win.createWindow();
        AppController.goDispatcher = new GoDispatcher(AppGlobal.paths().getGoDispatchPath());
        const bootstrap = setInterval(() => {
            if (GoDispatcher.listening && win.isExist) {
                clearInterval(bootstrap);
                AppGlobal.set("GoDispatcher", AppController.goDispatcher);
                AppController.typieListener = new TypieListener(new PackageLoader(win, config));
            }
        }, 1);
    }

    public static windowAllClosed() {
        // quit application when all windows are closed
        // on macOS it is common for applications to stay open until the user explicitly quits
        // if (process.platform !== "darwin") {
            AppController.quit();
        // }
    }

    public static willQuit(e) {
        if (!AppController.persisted && !AppController.allowQuit) {
            e.preventDefault();
            AppController.goDispatcher.send(new Packet("persist"))
                .then(res => {
                    console.log("Persist request: ", res);
                    AppController.persisted = true;
                    AppController.quit();
                })
                .catch(err => {
                    console.log("could not persist DB on quit", err);
                    AppController.allowQuit = true;
                    AppController.quit();
                });
        }
    }

    public static quit() {
        globalShortcut.unregisterAll();
        if (AppController.goDispatcher && AppController.goDispatcher.hasOwnProperty("close")) {
            AppController.goDispatcher.close();
            console.info("Closing Go Dispatcher");
        }
        console.info("Quitting App -> Bye Bye");
        app.quit();
    }

    public static setStartOnStartup() {
        // const appFolder = path.dirname(process.execPath);
        // const updateExe = Path.resolve(appFolder, "..", "Update.exe");
        // const exeName = Path.basename(process.execPath);

        app.setLoginItemSettings({
            openAsHidden: true,
            openAtLogin: true,
            // path: updateExe,
            // args: [
            //     "--processStart", `"${exeName}"`,
            //     "--process-start-args", `"--hidden"`,
            // ]
        });
    }

    public static setDoNotStartOnStartup() {
        app.setLoginItemSettings({
            openAsHidden: false,
            openAtLogin: false,
        });
    }

    public static isStatupAtLoginOn(): boolean {
        const settingsObj = app.getLoginItemSettings();
        return settingsObj.openAtLogin;
    }

    private static goDispatcher: GoDispatcher;
    private static typieListener: TypieListener;
}
