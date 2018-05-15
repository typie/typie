import {app} from "electron";
import log from "electron-log";
import Path from "path";
declare const __static: any;

export default class AppGlobal {

    public static settings: any;

    public static init() {
        log.transports.file.file = Path.join(__static, "typie.log");
        log.transports.file.level = "debug";
        log.transports.console.level = "debug";
        console.log = (...args) => log.debug(...args);
        console.info = (...args) => log.info(...args);
        console.warn = (...args) => log.warn(...args);
        console.error = (...args) => log.error(...args, new Error().stack);

        AppGlobal.startTime = Date.now();
        AppGlobal.setGlobal("staticPath", __static);
        AppGlobal.setGlobal("typeLogPath", Path.join(__static, "typie.log"));
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
