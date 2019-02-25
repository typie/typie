
import "./helpers/ApplicationEnvironment";
import AppListener from "./listeners/AppListener";
import MakeSingular from "./helpers/MakeSingleInstance";
import MainWindowController from "./controllers/MainWindowController";

const mainWindow = new MainWindowController();
(async () => {
    try {
        console.log(1);
        await MakeSingular.init();
        console.log(2);
        AppListener.init(mainWindow);
        console.log(3);
    } catch (e) {
        console.log(e);
        console.log(4);
        throw new Error("Oops! Something went wrong");
    }
})().catch(console.log);

console.info("Application started...");
