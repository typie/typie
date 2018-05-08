
import Settings from "./services/Settings";
import AppGlobal from "./helpers/AppGlobal";
import AppListener from "./listeners/AppListener";
import MakeSingular from "./helpers/MakeSingleInstance";
import WindowsListener from "./listeners/WindowsListener";
import ShortcutListener from "./listeners/ShortcutListener";
import MainWindowController from "./controllers/MainWindowController";

const log = require('electron-log');
log.transports.file.file = __static + '/typie.log';
log.transports.file.level = 'debug';
log.transports.console.level = 'debug';
console.log = (...args) => log.debug(...args);
console.info = (...args) => log.info(...args);
console.warn = (...args) => log.warn(...args);
console.error = (...args) => log.error(...args, new Error().stack);

AppGlobal.init();

let config = new Settings();
let mainWindow = new MainWindowController();
AppListener.listen(mainWindow, config);

let bootstrap = setInterval(() => {
    if (mainWindow.isExist && !config.isLoading) {
        clearInterval(bootstrap);
        MakeSingular.init(mainWindow);
        WindowsListener.listen(mainWindow);
        ShortcutListener.listen(mainWindow, config);
    }
}, 5);

console.log("Application started...");

