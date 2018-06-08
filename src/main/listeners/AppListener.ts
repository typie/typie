import {app, ipcMain} from "electron";
import AppController from "../controllers/AppController";
import {AppGlobal} from "typie-sdk";
import ConfigLoader from "../services/ConfigLoader";
import MainWindowController from "../controllers/MainWindowController";
import ShortcutListener from "../listeners/ShortcutListener";
import log from "electron-log";
import Path from "path";
import TrayBuilder from "../helpers/TrayBuilder";
declare const __static: any;

export default class AppListener {

    public static init(win: MainWindowController): void {
        const logPath = Path.join(Path.join(__static, "db"), "typie.log");
        log.transports.file.file = logPath;
        log.transports.file.level = "debug";
        log.transports.console.level = "debug";
        console.log = (...args) => log.debug(...args);
        console.info = (...args) => log.info(...args);
        console.warn = (...args) => log.warn(...args);
        console.error = (...args) => log.error(...args, new Error().stack);

        AppGlobal.startTime = Date.now();
        AppGlobal.set("staticPath", __static);
        AppGlobal.set("logPath", logPath);
        app.disableHardwareAcceleration();

        AppListener.listen(win);
    }

    public static listen(win: MainWindowController): void {

        const config = new ConfigLoader();
        config.on("config-loaded", () => ShortcutListener.listen(win, config));
        config.on("config-reload", () => ShortcutListener.removeListeners(config));

        app.on("window-all-closed", () => AppController.windowAllClosed());
        app.on("will-quit", (e) => AppController.willQuit(e));
        app.on("activate", () => win.activate());
        app.on("ready", () => {
            AppController.bootstrapApp(win, config);
            ShortcutListener.listen(win, config);
            TrayBuilder.init();

            win.on("resize", () => { return; });
            win.on("blur",   () => win.hide());
            win.on("focus",  () => win.send("focus"));
            win.on("closed", () => win.closed());

            win.onWebContent("did-finish-load", () => win.init());
            win.onWebContent("devtools-opened", () => win.setFocusAfterDevToolOpen());

            ipcMain.on("hide", () => win.hide());
            ipcMain.on("setHeight", (e, height) => win.setHeight(height));
        });
    }
}
