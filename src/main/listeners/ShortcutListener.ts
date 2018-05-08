import {globalShortcut} from "electron";
import MainWindowController from "../controllers/MainWindowController";
import Settings from "../services/Settings";

class ShortcutListener {
    public listen(win: MainWindowController, config: Settings): void {
        let toggleKeys = config.getConfig().toggleKeys;
        console.log('togglekeys', toggleKeys);
        for (let toggleShortcut of toggleKeys) {
            globalShortcut.register(toggleShortcut, () => win.toggle());
        }
    }
}
export default new ShortcutListener();
