import {globalShortcut} from 'electron';

import AppController from "../controllers/AppController";
import MainWindowController from "../controllers/MainWindowController";
const is = require('electron-is');

class ShortcutListener
{
    public listen(win: MainWindowController):void {
        globalShortcut.register('Alt+x', () => win.toggle());
        globalShortcut.register('Ctrl+Space', () => win.toggle());
        globalShortcut.register('Alt+a', () => win.send('openPackage', 'Files'));

        if (is.windows()) {
            globalShortcut.register('Alt+s', () => {

            })
        }
    }
}
export default new ShortcutListener();