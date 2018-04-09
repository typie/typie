import {app} from 'electron';
import Settings from "../services/Settings";
import AppController from "../controllers/AppController";
import MainWindowController from "../controllers/MainWindowController";

class AppListener
{
    public listen(win: MainWindowController, config: Settings):void {
        app.on('window-all-closed', () => AppController.windowAllClosed());
        app.on('activate', () => win.activate());
        app.on('ready', () => AppController.bootstrapApp(win, config));
    }
}
export default new AppListener();