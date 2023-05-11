
import type * as Electron from "electron";
import * as path from "path";
import { format as formatUrl } from "url";

import {app, BrowserWindow} from "electron";
import * as is from "electron-is";
import {resolve} from "node:path";

class AbstractWindowController {
    public _isExist: boolean = false;
    public isVisible: boolean = false;
    protected win: BrowserWindow | undefined;
    private position: number[] = [0, 0];

    constructor() {
        this._isExist = false;
    }

    get isExist(): boolean {
        return this._isExist || !!this.win;
    }

    public absCreateWindow(options: Electron.BrowserWindowConstructorOptions): void {
        console.info("Create Window");
        this.win = new BrowserWindow(options);
    }

    public loadWin() {
        if (is.dev()) {
            this.win!.webContents.openDevTools();
        }

        if (is.dev() && import.meta.env.VITE_DEV_SERVER_URL) {
            console.debug(`load url: ${import.meta.env.VITE_DEV_SERVER_URL}`);
            this.win!.loadURL(import.meta.env.VITE_DEV_SERVER_URL);
        } else {
            this.win!.loadFile(resolve(__dirname, "../../renderer/dist/index.html"));
            // this.win!.loadURL(formatUrl({
            //     pathname: path.join(__dirname, "index.html"),
            //     protocol: "file",
            //     slashes: true,
            // }));
        }

        this._isExist = true;
        this.isVisible = false;
    }

    public send(channel: string, ...args: any[]): void {
        if (this.isExist) {
            this.win!.webContents.send(channel, ...args);
        }
    }

    public on(event: any, callback: (res) => void): void {
        this.win!.on(event, callback);
    }

    public onWebContent(event: any, callback: (res) => void): void {
        this.win!.webContents.on(event, callback);
    }

    public init(): void {

        this.position = this.win!.getPosition();
        console.log("init", this.position);
        this.isVisible = true;
        // this.hide();
        this.win!.setHasShadow(false);
        this.win!.show();
    }

    public show(): void {
        // this.win!.show();
        this.win!.focus();
        if (!this.isVisible) {
            if (is.windows()) {
                this.win!.setPosition(this.position[0], this.position[1], false);
                this.win!.setPosition(this.position[0], this.position[1], false);
                // this.send("showCss");
            } else if (is.osx()) {
                app.show();
            } else {
                this.win!.show();
            }
            this.isVisible = true;
        }
        app.focus();
    }

    public hide(): void {
        if (this.isVisible) {
            this.position = this.win!.getPosition();
            if (is.windows()) {
                this.win!.setPosition(5000, 5000, false);
                // this.send("hideCss");
                this.win!.minimize();
                this.win!.showInactive();
            } else if (is.osx()) {
                app.hide();
            } else {
                this.win!.hide();
            }

            this.send("changePackage", null); // clear any set packages in search
            this.isVisible = false;
        }
    }

    // todo: when electron api will better support transparent click through both in mac and windows
    // todo: we will need to replace this logic; and never call setHeight -> its sluggish now.qwe
    public setHeight(height): void {
        this.win!.setSize(this.win!.getContentSize()[0], height);
    }

    public toggle(): void {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    public focus(): void {
        this.win!.focus();
    }

    public closed(): void {
        this.win = undefined;
        this._isExist = false;
    }

    public setFocusAfterDevToolOpen() {
        this.focus();
        setImmediate(() => this.focus());
    }
}

export default AbstractWindowController;
