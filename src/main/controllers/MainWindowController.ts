import * as fs from 'fs';
import * as path from "path";
import {BrowserWindowConstructorOptions} from 'electron';
import AbstractWindowController from "./AbstractWindowController";
import AppGlobal from "../helpers/AppGlobal";
import StyleLoader from "../services/StyleLoader";

export default class MainWindowController extends AbstractWindowController
{
    private options: BrowserWindowConstructorOptions = {
        show: false,
        width: 475,
        height: 300,
    };

    // create main BrowserWindow when electron is ready
    public createWindow(options?: BrowserWindowConstructorOptions) {
        options = options || this.options;
        super.absCreateWindow(options);
    }

    // on macOS it is common to re-create a window even after all windows have been closed
    // public activate() {
    //     if (this.isExist) {
    //         this.createWindow()
    //     }
    // }

    public init() {
        console.log('content window finished loading in ' + (AppGlobal.getTimeSinceInit() / 1000) + ' seconds');
        new StyleLoader(this);
        this.show();
    }
}



