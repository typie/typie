import {globalShortcut} from "electron";
import MainWindowController from "../controllers/MainWindowController";
import ConfigLoader from "../services/ConfigLoader";

export default class ShortcutListener {

    public static listen(win: MainWindowController, config: ConfigLoader): void {
        const toggleKeys = config.getSettings().toggleKeys;
        try {
            for (const toggleShortcut of toggleKeys) {
                globalShortcut.register(toggleShortcut, () => win.toggle());
            }
            console.log("listening for shortcuts:", toggleKeys);
        } catch (e) {
            console.error("cannot find and toggle keys for the application. please make sure you config is valid.", e);
        }
    }

    public static removeListeners(config: ConfigLoader): void {
        const toggleKeys = config.getSettings().toggleKeys;
        if (toggleKeys) {
            for (const toggleShortcut of toggleKeys) {
                globalShortcut.unregister(toggleShortcut);
            }
        }
    }
}
