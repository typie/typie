import {globalShortcut} from 'electron';

import MainWindowController from "../controllers/MainWindowController";
const is = require('electron-is');

class ShortcutListener
{
    public listen(win: MainWindowController):void {
        if (is.windows()) {
            globalShortcut.register('Alt+x', () => win.toggle());
            globalShortcut.register('Alt+Space', () => win.toggle());
            globalShortcut.register('Ctrl+Space', () => win.toggle());
        }
    }
}
export default new ShortcutListener();