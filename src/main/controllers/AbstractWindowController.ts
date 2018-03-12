
import Electron from "electron";
import { format as formatUrl } from 'url';
import * as path from 'path'

const isDevelopment = process.env.NODE_ENV !== 'production';

class AbstractWindowController
{
    protected win = <Electron.BrowserWindow>{};
    protected _isExist: boolean = false;
    private _isVisible: boolean = false;

    constructor() {
        this.isExist = false;
        this.win = <Electron.BrowserWindow>{};
    }

    get isExist(): boolean {
        return this._isExist;
    }
    set isExist(isExist:boolean) {
        this._isExist = isExist;
    }
    get isVisible(): boolean {
        return this._isVisible;
    }
    set isVisible(value: boolean) {
        this._isVisible = value;
    }

    public absCreateWindow(options: Electron.BrowserWindowConstructorOptions): void{
        console.log('Create Window');
        this.win = new Electron.BrowserWindow(options);

        if (isDevelopment) {
            this.win.webContents.openDevTools()
        }

        if (isDevelopment) {
            this.win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
        }
        else {
            this.win.loadURL(formatUrl({
                pathname: path.join(__dirname, 'index.html'),
                protocol: 'file',
                slashes: true
            }))
        }

        this.isExist = true;
        this.isVisible = false;
    }

    public send(channel: string, ...args: any[]): void {
        if (this.isExist) {
            this.win.webContents.send(channel, args);
        }
    }

    public on(event: any, callback: Function): void {
        this.win.on(event, callback);
    }

    public onWebContent(event: any, callback: Function): void {
        this.win.webContents.on(event, callback);
    }

    public init(): void {}

    public show(): void {
        this.win.show();
        this.isVisible = true;
    }

    public focus(): void {
        this.win.focus();
    }

    public closed(): void{
        this.win = <Electron.BrowserWindow>{};
        this.isExist = false;
    }

    public setFocusAfterDevToolOpen() {
        this.focus();
        setImmediate(() => this.focus());
    }
}

export default AbstractWindowController