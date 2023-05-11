import {app} from "electron";
import AppController from "../controllers/AppController";

export default class MakeSingleInstance {
    public static init(): Promise<void> {
        return new Promise((resolve) => {
            const gotTheLock = app.requestSingleInstanceLock();
            if (!gotTheLock) {
                AppController.allowQuit = true;
                AppController.quit();
                resolve();
            } else {
                resolve();
            }
        });
    }
}
