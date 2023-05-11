
export default class AppGlobal {

    public static settings: any;
    public static startTime: number;

    public static getTimeSinceInit() {
        return Date.now() - AppGlobal.startTime;
    }

    public static getSettings() {
        return AppGlobal.settings;
    }

    public static set(name: string, obj: any): void {
        global[name] = obj;
    }

    public static get(name: string): any {
        return global[name];
    }

    public static paths() {
        return {
            getStaticPath(): string { return global["paths.staticPath"]; },
            setStaticPath(absPath: string) { global["paths.staticPath"] = absPath; },
            getConfigDir(): string { return global["paths.configDir"]; },
            setConfigDir(absPath: string) { global["paths.configDir"] = absPath; },
            getMainConfigPath(): string { return global["paths.mainConfigPath"]; },
            setMainConfigPath(absPath: string) { global["paths.mainConfigPath"] = absPath; },
            getPackagesPath(): string { return global["paths.packagesPath"]; },
            setPackagesPath(absPath: string) { global["paths.packagesPath"] = absPath; },
            getUserDataPath(): string { return global["paths.userDataPath"]; },
            setUserDataPath(absPath: string) { global["paths.userDataPath"] = absPath; },
            getLogPath(): string { return global["paths.logPath"]; },
            setLogPath(absPath: string) { global["paths.logPath"] = absPath; },
            getLogsDir(): string { return global["paths.logsDir"]; },
            setLogsDir(absPath: string) { global["paths.logsDir"] = absPath; },
            getGoDispatchPath(): string { return global["paths.goDispatchPath"]; },
            setGoDispatchPath(absPath: string) { global["paths.goDispatchPath"] = absPath; },
            getThemesPath(): string { return global["paths.themesPath"]; },
            setThemesPath(absPath: string) { global["paths.themesPath"] = absPath; },
            getSelectedThemePath(): string { return global["paths.selectedThemePath"]; },
            setSelectedThemePath(absPath: string) { global["paths.selectedThemePath"] = absPath; },
            getSelectedThemeDir(): string { return global["paths.selectedThemeDir"]; },
            setSelectedThemeDir(absPath: string) { global["paths.selectedThemeDir"] = absPath; },
            getDbFolder(): string { return global["paths.dbFolder"]; },
            setDbFolder(absPath: string) { global["paths.dbFolder"] = absPath; },
        };
    }
}
