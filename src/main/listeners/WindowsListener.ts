import AbstractWindowController from "../controllers/AbstractWindowController";

export default class WindowsListener
{
    protected static start(win: AbstractWindowController) {

        win.on('resize',    () => console.log('resize happen'));
        win.on('blur',      () => console.log('blur happen'));
        win.on('closed',    () => win.closed());

        win.onWebContent('did-finish-load', () => win.init());
        win.onWebContent('devtools-opened', () => win.setFocusAfterDevToolOpen());
    }

    public static listen(win: AbstractWindowController):void {
        let bootstrap = setInterval(() => {
            if (win.isExist) {
                clearInterval(bootstrap);
                this.start(win);
            }
        }, 5);
    }
}
