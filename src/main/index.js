
import "./helpers/ApplicationEnvironment";
import AppListener from "./listeners/AppListener";
import MakeSingular from "./helpers/MakeSingleInstance";
import MainWindowController from "./controllers/MainWindowController";
import {createFolderIfNotExist} from "./helpers/HelperFunc";
import {AppGlobal} from "typie-sdk";

Promise.all([
    createFolderIfNotExist(AppGlobal.paths().getConfigDir()),
    createFolderIfNotExist(AppGlobal.paths().getDbFolder()),
    createFolderIfNotExist(AppGlobal.paths().getLogsDir()),
]).then(() => {
    const mainWindow = new MainWindowController();
    MakeSingular.init(mainWindow);
    AppListener.init(mainWindow);
    console.info("Application started...");
}).catch(err => {
    console.error("Could not start Application", err);
    throw new Error("Could not start Application");
});
