import {app} from "electron";
import log from "electron-log";
import Path from "path";
import * as is from "electron-is";
import {AppGlobal} from "typie-sdk";
declare const __static: any;

const userDataPath = app.getPath("userData");
const logPath = Path.join(userDataPath, "logs", "typie.log");
const packagesPath = Path.join(userDataPath, "packages");
const configDir = Path.join(userDataPath, "config");
const mainConfigPath = Path.join(configDir, "config.yml");
const themesPath = Path.join(__static, "themes");
const selectedThemeDir = Path.join(themesPath, "default");
const selectedThemePath = Path.join(selectedThemeDir, "style.css");

let goDispatchPath;
if (is.windows()) {
    goDispatchPath = Path.join(__static, "bin/typie_go.exe");
} else if (is.osx()) {
    goDispatchPath = Path.join(__static, "bin/typie_go");
}

AppGlobal.startTime = Date.now();
AppGlobal.set("staticPath", __static);
AppGlobal.paths().setStaticPath(__static);
AppGlobal.paths().setConfigDir(configDir);
AppGlobal.paths().setMainConfigPath(mainConfigPath);
AppGlobal.paths().setUserDataPath(userDataPath);
AppGlobal.paths().setPackagesPath(packagesPath);
AppGlobal.paths().setLogPath(logPath);
AppGlobal.paths().setGoDispatchPath(goDispatchPath);
AppGlobal.paths().setThemesPath(themesPath);
AppGlobal.paths().setSelectedThemeDir(selectedThemeDir);
AppGlobal.paths().setSelectedThemePath(selectedThemePath);

app.disableHardwareAcceleration();
log.transports.file.file = logPath;
log.transports.file.level = "debug";
log.transports.console.level = "debug";
console.log = (...args) => log.debug(...args);
console.info = (...args) => log.info(...args);
console.warn = (...args) => log.warn(...args);
console.error = (...args) => log.error(...args, new Error().stack);