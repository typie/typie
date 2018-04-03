global.__static = "";

import Settings from "./services/Settings";
import AppGlobal from './helpers/AppGlobal';
import AppListener from './listeners/AppListener';
import MakeSingular from "./helpers/MakeSingleInstance";
import WindowsListener from './listeners/WindowsListener';
import ShortcutListener from './listeners/ShortcutListener';
import MainWindowController from "./controllers/MainWindowController";

AppGlobal.init();
Settings.init();

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow = new MainWindowController();
AppListener.listen(mainWindow);

let bootstrap = setInterval(() => {
    if (mainWindow.isExist) {
        clearInterval(bootstrap);
        MakeSingular.init(mainWindow);
        WindowsListener.listen(mainWindow);
        ShortcutListener.listen(mainWindow);
    }
}, 5);


console.log('Application started...');

