
import "./helpers/ApplicationEnvironment";
import AppListener from "./listeners/AppListener";
import MakeSingular from "./helpers/MakeSingleInstance";
import MainWindowController from "./controllers/MainWindowController";

const mainWindow = new MainWindowController();
MakeSingular.init(mainWindow);
AppListener.init(mainWindow);
console.info("Application started...");
