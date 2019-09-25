process.on("uncaughtException", e => console.log("uncaughtException was fired", e));

import "./helpers/ApplicationEnvironment";
import AppListener from "./listeners/AppListener";
import MakeSingular from "./helpers/MakeSingleInstance";
import MainWindowController from "./controllers/MainWindowController";

const mainWindow = new MainWindowController();
(async () => {
    try {
        await MakeSingular.init();
        AppListener.init(mainWindow);
    } catch (e) {
        console.log(e);
        throw new Error("Oops! Something went wrong");
    }
})().catch(console.log);

console.info("Application started...");
