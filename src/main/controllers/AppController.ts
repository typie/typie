import {app} from 'electron';
import MainWindowController from "./MainWindowController";
import GoDispatcher from "../services/GoDispatcher";
import PackageLoader from "../services/PackageLoader";
//import MovieSearch from "../../../static/packages/MovieSearch/index.js";

export default class AppController
{
    public static bootstrapApp(win: MainWindowController) {
        GoDispatcher.startListen();
        let bootstrap = setInterval(() => {
            if (GoDispatcher.listening) {
                clearInterval(bootstrap);
                PackageLoader.init();
            }
        }, 1);
        win.createWindow();
    }

    public static windowAllClosed() {
        // quit application when all windows are closed
        // on macOS it is common for applications to stay open until the user explicitly quits
        if (process.platform !== 'darwin') {
            AppController.quit()
        }
    }

    public static quit() {
        app.quit();
    }
}

