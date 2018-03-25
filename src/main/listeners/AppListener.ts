import {app} from 'electron';
import AppController from "../controllers/AppController";
import MainWindowController from "../controllers/MainWindowController";

class AppListener
{
    public listen(win: MainWindowController):void {
        app.on('window-all-closed', () => AppController.windowAllClosed());
        app.on('activate', () => win.activate());
        app.on('ready', () => AppController.bootstrapApp(win));
    }
}
export default new AppListener();