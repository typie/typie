import {app, ipcMain, protocol} from "electron";
import AppController from "../controllers/AppController";
import ConfigLoader from "../services/ConfigLoader";
import type MainWindowController from "../controllers/MainWindowController";
import ShortcutListener from "../listeners/ShortcutListener";
import TrayBuilder from "../helpers/TrayBuilder";
import type NotificationWindowController from "/@/controllers/NotificationWindowController";
import NotificationListener from "/@/listeners/NotificationListener";
import url from "node:url";

export default class AppListener {

    public static init(win: MainWindowController, notificationWin: NotificationWindowController): void {
        const config = new ConfigLoader();
        app.on("ready", async () => {
            protocol.registerFileProtocol("atom", (request, callback) => {
                const filePath = url.fileURLToPath("file://" + request.url.slice("atom://".length));
                callback(filePath);
            });
            await AppController.bootstrapApp(win, notificationWin, config);
            await AppController.bootstrapGoDispatcher(win, config);
            ShortcutListener.listen(win, config);
            TrayBuilder.init();
            AppListener.listen(win, config);
            NotificationListener.listen(notificationWin, config);
            win.loadWin();
            notificationWin.loadWin();
        });
        app.on("window-all-closed", () => AppController.windowAllClosed());
        app.on("will-quit", (e) => AppController.willQuit(e));
        app.on("activate", () => {
            win.activate();
            notificationWin.activate();
        });
    }

    public static listen(win: MainWindowController, config: ConfigLoader): void {
        config.on("config-loaded", () => ShortcutListener.listen(win, config));
        config.on("config-reload", () => ShortcutListener.removeListeners(config));

        win.on("resize", () => { return; });
        win.on("focus",  () => win.send("focus"));
        win.on("closed", () => win.closed());
        win.on("blur",   () => {
            if (config.getSettings().hideOnBlur) {
                win.hide();
            }
        });

        win.onWebContent("did-finish-load", () => win.init());
        win.onWebContent("devtools-opened", () => win.setFocusAfterDevToolOpen());

        ipcMain.on("hide", () => win.hide());
        ipcMain.on("setHeight", (e, height) => win.setHeight(height));
    }
}
