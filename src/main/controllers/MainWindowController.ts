
import {BrowserWindowConstructorOptions} from 'electron';
import AbstractWindowController from "./AbstractWindowController";
import AppGlobal from "../helpers/AppGlobal";


export default class MainWindowController extends AbstractWindowController
{
    private options: BrowserWindowConstructorOptions = {
        show: false,
        width: 200,
        height: 600,
    };

    // create main BrowserWindow when electron is ready
    public createWindow(options?: BrowserWindowConstructorOptions) {
        options = options || this.options;
        super.absCreateWindow(options);
    }

    // on macOS it is common to re-create a window even after all windows have been closed
    public activate() {
        if (this.isExist) {
            this.createWindow()
        }
    }

    public init() {
        console.log('content window finished loading in ' + (AppGlobal.getTimeSinceInit() / 1000) + ' seconds');
        this.show();
    }
}



