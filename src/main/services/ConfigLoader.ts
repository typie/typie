import AppController from "../controllers/AppController";
declare const __static: any;
import { app } from "electron";
import is from "electron-is";
import {EventEmitter} from "events";
import fs, {Stats} from "fs";
import yaml from "js-yaml";
import Path from "path";
import {AppGlobal} from "typie-sdk";
import chokidar from "chokidar";
import {createFolderIfNotExist} from "../helpers/HelperFunc";

export default class ConfigLoader extends EventEmitter {

    public static getData(path: string): any {
        let data;
        try {
            data = yaml.safeLoad(fs.readFileSync(path, "utf8"));
            if (data) {
                if (is.windows() && data.windows) {
                    data = data.windows;
                } else if (is.osx() && data.mac) {
                    data = data.mac;
                }
            }
        } catch (e) {
            console.warn("Missing configuration file at '" + path + "' using empty one", e);
        }
        return data ? data : {};
    }

    public static copy(from: string, to: string): void {
        try {
            fs.createReadStream(from).pipe(fs.createWriteStream(to));
        } catch (e) {
            console.error("copy file failed", e);
        }
    }

    public isLoading: boolean;
    public configDir: string;
    private configPath: string;
    private packagesPath: string;
    private isWatching: boolean;
    private settings: any;

    constructor() {
        super();
        this.settings = {};
        this.configDir = AppGlobal.paths().getConfigDir();
        this.configPath = AppGlobal.paths().getMainConfigPath();
        this.packagesPath = AppGlobal.paths().getPackagesPath();
        this.isLoading = true;
        this.isWatching = false;
    }

    public init() {
        this.loadSettings();
        AppGlobal.set("Settings", this);
    }

    public loadPkgConfig(pkgName, pkgPath): any {
        const defaultPkgConfigPath = Path.join(this.packagesPath, pkgName, "defaultConfig.yml");
        const userPkgConfigPath = Path.join(this.configDir, pkgName + ".yml");
        let pkgConfig = {};
        if (fs.existsSync(userPkgConfigPath)) {
            console.info("Loading user config for '" + pkgName);
            pkgConfig = ConfigLoader.getData(userPkgConfigPath);
        } else if (fs.existsSync(defaultPkgConfigPath)) {
            console.info("Loading default config for '" + pkgName);
            pkgConfig = ConfigLoader.getData(defaultPkgConfigPath);
            ConfigLoader.copy(defaultPkgConfigPath, userPkgConfigPath);
        } else {
            console.warn("Missing 'defaultConfig.yml' file for " + pkgName + " in " + defaultPkgConfigPath);
        }
        return pkgConfig;
    }

    public getSettings(): any {
        return this.settings;
    }

    public watchConfDir(): void {
        console.info("Watching Config folder...");

        // Initialize watcher.
        const watcher = chokidar.watch(this.configDir, {
            ignored: /(^|[\/\\])\../,
            persistent: true,
        });

        watcher.on("change", (path: string, stats: Stats) => {
            if (stats) {
                const packageChanged = Path.basename(path, Path.extname(path));
                if (packageChanged !== "config") {
                    console.info(`config change detected at '${packageChanged}'`);
                    this.emit("reloadPackage", packageChanged);
                } else {
                    console.info("change detected at main config -> reload needed");
                    this.configReload();
                }
            }
        });
    }

    private loadOrCreate(): void {
        if (fs.existsSync(this.configPath)) {
            console.info("Loading main config file from: " + this.configPath);
            this.settings = yaml.safeLoad(fs.readFileSync(this.configPath, "utf8"));
        } else {
            console.info("Building new config file from scratch");
            AppController.setStartOnStartup();
            this.settings = {
                toggleKeys: this.getToggleKeys(),
            };
            this.writeToFile(this.configPath, this.settings);
        }
        AppGlobal.settings = this.settings;
        this.isLoading = false;
        console.info("Config loaded:", this.settings);
        this.emit("config-loaded");
    }

    private configReload(): void {
        if (!this.isLoading) {
            this.isLoading = true;
            this.emit("config-reload");
            this.loadOrCreate();
        }
    }

    private getToggleKeys(): string[] {
        if (is.windows()) {
            return [
                "Alt+Space",
                "CommandOrControl+Space",
            ];
        } else if (is.osx()) {
            return [
                "Ctrl+x",
                "Ctrl+Space",
            ];
        } else {
            return ["CommandOrControl+Space"];
        }
    }

    private loadSettings(): void {
        try {
            this.loadOrCreate();
        } catch (e) {
            console.error(e);
            throw new Error("Error loading config.yml file, check if exist or is valid Yaml format.");
        }
    }

    private writeToFile(path, data) {
        try {
            console.info("creating user config file...");
            fs.writeFileSync(path, yaml.safeDump(data));
            this.isLoading = false;
        } catch (e) {
            console.error("could not create user config file in: " + path, e);
        }
    }
}
