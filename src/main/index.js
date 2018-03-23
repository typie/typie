global.__static = "";

import Settings from "./services/Settings";
import AppGlobal from './helpers/AppGlobal';
import AppListener from './listeners/AppListener';
import MakeSingular from "./helpers/MakeSingleInstance";
import WindowsListener from './listeners/WindowsListener';
import MainWindowController from "./controllers/MainWindowController";

AppGlobal.init();
Settings.init();

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow = new MainWindowController();

MakeSingular.init(mainWindow);
AppListener.listen(mainWindow);
WindowsListener.listen(mainWindow);

console.log('Application started...');

