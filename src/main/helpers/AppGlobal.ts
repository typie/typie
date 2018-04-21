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

    public static setGlobal(name: string, obj: any): void {
        global[name] = obj;
    }

    public static getGlobal(name: string): any {
        return global[name];
    }

    private static startTime: number;
}
