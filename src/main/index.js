global.__static = "";

import Settings from "./services/Settings";
import AppGlobal from './helpers/AppGlobal';
import AppListener from './listeners/AppListener';
import MakeSingular from "./helpers/MakeSingleInstance";
import WindowsListener from './listeners/WindowsListener';
import ShortcutListener from './listeners/ShortcutListener';
import MainWindowController from "./controllers/MainWindowController";

AppGlobal.init();

let config = new Settings();
let mainWindow = new MainWindowController();
AppListener.listen(mainWindow, config);

let bootstrap = setInterval(() => {
    if (mainWindow.isExist) {
        clearInterval(bootstrap);
        MakeSingular.init(mainWindow);
        WindowsListener.listen(mainWindow);
        ShortcutListener.listen(mainWindow);
    }
}, 5);


console.log('Application started...');

