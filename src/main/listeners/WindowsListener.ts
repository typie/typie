import {ipcMain} from 'electron';
import AbstractWindowController from "../controllers/AbstractWindowController";

class WindowsListener
{
    public listen(win: AbstractWindowController):void {
        win.on('resize', () => {});
        win.on('blur',   () => console.log('blur happen'));
        win.on('focus',  () => {console.log('focus event trigger'); win.send('focus');});
        win.on('closed', () => win.closed());

        win.onWebContent('did-finish-load', () => win.init());
        win.onWebContent('devtools-opened', () => win.setFocusAfterDevToolOpen());

        ipcMain.on('hide', () => win.hide());
    }
}
export default new WindowsListener();