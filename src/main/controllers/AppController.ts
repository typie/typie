import {app} from 'electron';
import MainWindowController from "./MainWindowController";
import GoDispatcher from "../services/GoDispatcher";
import MovieSearch from "../../../static/packages/MovieSearch/index.js";

export default class AppController
{
    public static bootstrapApp(win: MainWindowController) {
        win.createWindow();
        GoDispatcher.startListen();

        let movieSearch = new MovieSearch(win);
        // just for testing
        setTimeout(function () {
            movieSearch.insert('rotem1 more some');
            //movieSearch.insert('rotem2 more some');
            // movieSearch.insert('rotem3 3more some');
        }, 3000);

        setTimeout(function () {
            movieSearch.search('rotem1');
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

