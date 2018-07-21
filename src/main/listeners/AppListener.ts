import {app, ipcMain} from "electron";
import AppController from "../controllers/AppController";
import ConfigLoader from "../services/ConfigLoader";
import MainWindowController from "../controllers/MainWindowController";
import ShortcutListener from "../listeners/ShortcutListener";
import TrayBuilder from "../helpers/TrayBuilder";

export default class AppListener {

    public static init(win: MainWindowController): void {
        const config = new ConfigLoader();
        app.on("ready", async () => {
            await AppController.bootstrapApp(win, config);
            await AppController.bootstrapGoDispatcher(win, config);
            ShortcutListener.listen(win, config);
            TrayBuilder.init();
            AppListener.listen(win, config);
        });
        app.on("window-all-closed", () => AppController.windowAllClosed());
        app.on("will-quit", (e) => AppController.willQuit(e));
        app.on("activate", () => win.activate());
    }

    public static listen(win: MainWindowController, config: ConfigLoader): void {
        config.on("config-loaded", () => ShortcutListener.listen(win, config));
        config.on("config-reload", () => ShortcutListener.removeListeners(config));

        win.on("resize", () => { return; });
        win.on("blur",   () => win.hide());
        win.on("focus",  () => win.send("focus"));
        win.on("closed", () => win.closed());

        win.onWebContent("did-finish-load", () => win.init());
        win.onWebContent("devtools-opened", () => win.setFocusAfterDevToolOpen());

        ipcMain.on("hide", () => win.hide());
        ipcMain.on("setHeight", (e, height) => win.setHeight(height));
    }
}
