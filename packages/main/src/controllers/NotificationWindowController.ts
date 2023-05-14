import {app, type BrowserWindowConstructorOptions, globalShortcut} from "electron";
import {AppGlobal} from "../services/sdk";
import StyleLoader from "../services/StyleLoader";
import AbstractWindowController from "./AbstractWindowController";
import Path from "path";
import {join, resolve} from "node:path";
import * as is from "electron-is";
declare const __static: any;

export default class NotificationWindowController extends AbstractWindowController {

    private styleLoader: StyleLoader;

    private options: BrowserWindowConstructorOptions = {
        alwaysOnTop: true,
        frame: false,
        height: 437,
        icon: Path.join(__static, "themes/default/images/icons/icon.png"),
        maximizable: true,
        show: true,

        skipTaskbar: true,
        transparent: true,

        webPreferences: {
            // webSecurity: false,

            nodeIntegration: true,
            contextIsolation: true,
            // sandbox: false, // Sandbox disabled because the demo of preload script depend on the Node.js api
            // webviewTag: false, // The webview tag is not recommended. Consider alternatives like an iframe or Electron's BrowserView. @see https://www.electronjs.org/docs/latest/api/webview-tag#warning
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
        console.info("content notification window finished loading in " + (AppGlobal.getTimeSinceInit() / 1000) + " seconds");
        this.styleLoader.init();
        // this.show();
    }

    public loadWin() {
        if (is.dev()) {
            // this.win!.webContents.openDevTools();
        }

        if (is.dev() && import.meta.env.VITE_DEV_SERVER_URL) {
            const canvasUrl = `${import.meta.env.VITE_DEV_SERVER_URL}canvas.html`;
            console.debug(`load url: ${canvasUrl}`);
            this.win!.loadURL(`${canvasUrl}`);
        } else {
            this.win!.loadFile(resolve(__dirname, "../../renderer/dist/canvas.html"));
        }

        this._isExist = true;
        this.isVisible = false;
    }
}
