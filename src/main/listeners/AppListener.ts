import {app, ipcMain} from "electron";
import AppController from "../controllers/AppController";
import ConfigLoader from "../services/ConfigLoader";
import MainWindowController from "../controllers/MainWindowController";
import ShortcutListener from "../listeners/ShortcutListener";

class AppListener {
    public listen(win: MainWindowController, config: ConfigLoader): void {
        app.on("window-all-closed", () => AppController.windowAllClosed());
        app.on("activate", () => win.activate());
        app.on("ready", () => {
            AppController.bootstrapApp(win, config);

            win.on("resize", () => { return; });
            win.on("blur",   () => console.log("blur happen"));
            win.on("focus",  () => {console.log("focus event trigger"); win.send("focus"); });
            win.on("closed", () => win.closed());

            win.onWebContent("did-finish-load", () => win.init());
            win.onWebContent("devtools-opened", () => win.setFocusAfterDevToolOpen());

            ipcMain.on("hide", () => win.hide());
        });

        config.on("config-loaded", () => ShortcutListener.listen(win, config));
        config.on("config-reload", () => ShortcutListener.removeListeners(config));
    }
}
export default new AppListener();
