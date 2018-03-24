import {ipcMain} from 'electron';
import AbstractWindowController from "../controllers/AbstractWindowController";

class WindowsListener
{
    protected start(win: AbstractWindowController) {

        win.on('resize',    () => console.log('resize happen'));
        win.on('blur',      () => console.log('blur happen'));
        win.on('closed',    () => win.closed());

        win.onWebContent('did-finish-load', () => win.init());
        win.onWebContent('devtools-opened', () => win.setFocusAfterDevToolOpen());

    }

    public listen(win: AbstractWindowController):void {
        let bootstrap = setInterval(() => {
            if (win.isExist) {
                clearInterval(bootstrap);
                this.start(win);
            }
        }, 5);
    }
}
export default new WindowsListener();