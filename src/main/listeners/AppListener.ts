import {app} from 'electron';
import AppController from "../controllers/AppController";
import MainWindowController from "../controllers/MainWindowController";

export default class AppListener
{
    public static listen(win: MainWindowController):void {
        app.on('window-all-closed', () => AppController.windowAllClosed());
        app.on('activate', () => win.activate());
        app.on('ready', () => win.createWindow());
    }
}
