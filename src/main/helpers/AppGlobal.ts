import {app} from "electron";

export default class AppGlobal {

    public static settings: any;

    public static init() {
        AppGlobal.startTime = Date.now();
        app.disableHardwareAcceleration();
    }

    public static getTimeSinceInit() {
        return Date.now() - AppGlobal.startTime;
    }

    public static getSettings() {
        return AppGlobal.settings;
    }

    private static startTime: number;
}
