import {BrowserWindowConstructorOptions, globalShortcut} from "electron";
import AppGlobal from "../helpers/AppGlobal";
import StyleLoader from "../services/StyleLoader";
import AbstractWindowController from "./AbstractWindowController";

export default class MainWindowController extends AbstractWindowController {

    private styleLoader: StyleLoader;

    private options: BrowserWindowConstructorOptions = {
        alwaysOnTop: true,
        frame: false,
        height: 900,
        show: false,
        transparent: true,
        width: 475,
    };

    constructor() {
        super();
        this.styleLoader = new StyleLoader(this);
    }

    // create main BrowserWindow when electron is ready
    public createWindow(options?: BrowserWindowConstructorOptions) {
        options = options || this.options;
        super.absCreateWindow(options);
    }

    // on macOS it is common to re-create a window even after all windows have been closed
    public activate() {
        if (!this.isExist) {
            this.createWindow();
        }
    }

    public init() {
        super.init();
        this.win.setIgnoreMouseEvents(true);
        console.log("content window finished loading in " + (AppGlobal.getTimeSinceInit() / 1000) + " seconds");
        this.styleLoader.init();
        // this.show();
    }

    public registerKey(key: string, callback: (res) => void) {
        globalShortcut.register(key, callback);
    }

    public unregisterKey(key: string) {
        globalShortcut.unregister(key);
    }
}
