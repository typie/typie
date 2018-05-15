
import AppGlobal from "./helpers/AppGlobal";
import AppListener from "./listeners/AppListener";
import MakeSingular from "./helpers/MakeSingleInstance";
import MainWindowController from "./controllers/MainWindowController";

AppGlobal.init();

const mainWindow = new MainWindowController();
MakeSingular.init(mainWindow);
AppListener.listen(mainWindow);

console.log("Application started...");
