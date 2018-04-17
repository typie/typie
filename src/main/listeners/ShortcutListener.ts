import {globalShortcut} from 'electron';
import Settings from "../services/Settings";
import MainWindowController from "../controllers/MainWindowController";
const is = require('electron-is');

class ShortcutListener
{
    public listen(win: MainWindowController, config: Settings):void {
        globalShortcut.register('CommandOrControl+Space', () => win.toggle());
        if (is.windows()) {
            globalShortcut.register('Alt+x', () => win.toggle());
            globalShortcut.register('Alt+Space', () => win.toggle());
        } else {
            globalShortcut.register('Super+x', () => win.toggle());
            globalShortcut.register('Super+Space', () => win.toggle());
        }
    }
}
export default new ShortcutListener();