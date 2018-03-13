import {app} from 'electron';
import MainWindowController from "./MainWindowController";
import GoDispatcher from "../services/GoDispatcher";
import Haste from "../services/Haste";

export default class AppController
{
    public static bootstrapApp(win: MainWindowController) {
        win.createWindow();
        GoDispatcher.startListen();

        // just for testing
        setTimeout(function () {

        }, 5000);
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

