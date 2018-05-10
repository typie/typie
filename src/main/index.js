
import AppGlobal from "./helpers/AppGlobal";
import AppListener from "./listeners/AppListener";
import ConfigLoader from "./services/ConfigLoader";
import MakeSingular from "./helpers/MakeSingleInstance";
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

let config = new ConfigLoader();
let mainWindow = new MainWindowController();
MakeSingular.init(mainWindow);
AppListener.listen(mainWindow, config);

console.log("Application started...");
