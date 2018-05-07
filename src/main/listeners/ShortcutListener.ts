import {globalShortcut} from "electron";
import is from "electron-is";
import MainWindowController from "../controllers/MainWindowController";
import Settings from "../services/Settings";

class ShortcutListener {
    public listen(win: MainWindowController, config: Settings): void {
        for (let toggleShortcut of config.settings.toggleKeys) {
            console.log("toggle key: " + toggleShortcut);
        }
        // globalShortcut.register("CommandOrControl+Space", () => win.toggle());
        // if (is.windows()) {
        //     globalShortcut.register("Alt+x", () => win.toggle());
        //     globalShortcut.register("Alt+Space", () => win.toggle());
        // } else {
        //     globalShortcut.register("Ctrl+x", () => win.toggle());
        //     globalShortcut.register("Ctrl+Space", () => win.toggle());
        // }
    }
}
export default new ShortcutListener();
