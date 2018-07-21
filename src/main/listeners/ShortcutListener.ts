import {globalShortcut} from "electron";
import ConfigLoader from "../services/ConfigLoader";
import MainWindowController from "../controllers/MainWindowController";

export default class ShortcutListener {

    public static listen(win: MainWindowController, config: ConfigLoader): void {
        const toggleKeys = config.getSettings().toggleKeys;
        try {
            for (const toggleShortcut of toggleKeys) {
                globalShortcut.register(toggleShortcut, () => win.toggle());
            }
            console.info("listening for shortcuts:", toggleKeys);
        } catch (e) {
            console.error("cannot find and toggle keys for the application. please make sure you config is valid.", e);
        }
    }

    public static removeListeners(config: ConfigLoader): void {
        const toggleKeys = config.getSettings().toggleKeys;
        if (toggleKeys) {
            console.info("removing toggle keys", toggleKeys);
            for (const toggleShortcut of toggleKeys) {
                globalShortcut.unregister(toggleShortcut);
            }
        }
    }
}
