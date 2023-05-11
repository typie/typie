import {app, type BrowserWindowConstructorOptions, globalShortcut} from "electron";
import {AppGlobal} from "../services/sdk";
import StyleLoader from "../services/StyleLoader";
import AbstractWindowController from "./AbstractWindowController";
import Path from "path";
import {join} from "node:path";
declare const __static: any;

export default class MainWindowController extends AbstractWindowController {

    private styleLoader: StyleLoader;

    private options: BrowserWindowConstructorOptions = {
        alwaysOnTop: true,
        frame: true,
        height: 437,
        icon: Path.join(__static, "themes/default/images/icons/icon.png"),
        maximizable: false,
        show: false,

        skipTaskbar: false,
        transparent: false,

        webPreferences: {
            // webSecurity: false,

            nodeIntegration: true,
            contextIsolation: true,
            sandbox: false, // Sandbox disabled because the demo of preload script depend on the Node.js api
            webviewTag: false, // The webview tag is not recommended. Consider alternatives like an iframe or Electron's BrowserView. @see https://www.electronjs.org/docs/latest/api/webview-tag#warning
            preload: join(app.getAppPath(), "packages/preload/dist/index.cjs"),
        },
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
        // this.win.setIgnoreMouseEvents(true);
        console.info("content window finished loading in " + (AppGlobal.getTimeSinceInit() / 1000) + " seconds");
        this.styleLoader.init();
        // this.show();
    }

    public registerKey(key: string, callback: () => void) {
        globalShortcut.register(key, callback);
    }

    public unregisterKey(key: string) {
        globalShortcut.unregister(key);
    }
}
