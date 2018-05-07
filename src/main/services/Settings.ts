
declare const __static: any;
import {app} from "electron";
import is from "electron-is";
import {EventEmitter} from "events";
import fs from "fs";
import yaml from "js-yaml";
import mkdirp from "mkdirp";
import Path from "path";
import AppGlobal from "../helpers/AppGlobal";

export default class Settings extends EventEmitter {

    public static getData(path: string): object {
        let data;
        try {
            data = yaml.safeLoad(fs.readFileSync(path, "utf8"));
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
    private isWatching: boolean;
    private settings: object;

    constructor() {
        super();
        this.settings = {};
        this.configDir = Path.join(app.getPath("userData"), "config");
        this.configPath = Path.join(this.configDir, "config.yml");
        this.isLoading = true;
        this.isWatching = false;
        this.loadSettings();
        AppGlobal.setGlobal("Settings", this);
    }

    public loadPkgConfig(pkgName, pkgPath): any {
        const defaultPkgConfigPath = Path.join(__static, "packages/" + pkgName + "/defaultConfig.yml");
        const userPkgConfigPath = Path.join(this.configDir, pkgName + ".yml");
        let pkgConfig = {};
        if (fs.existsSync(userPkgConfigPath)) {
            console.log("Loading user config for '" + pkgName);
            pkgConfig = Settings.getData(userPkgConfigPath);
        } else if (fs.existsSync(defaultPkgConfigPath)) {
            console.log("Loading default config for '" + pkgName);
            pkgConfig = Settings.getData(defaultPkgConfigPath);
            Settings.copy(defaultPkgConfigPath, userPkgConfigPath);
        } else {
            console.warn("Missing 'defaultConfig.yml' file for " + pkgName + " in " + defaultPkgConfigPath);
        }
        return pkgConfig;
    }

    private loadOrCreate(): void {
        if (fs.existsSync(this.configPath)) {
            console.log("loading main config file...");
            const settings = yaml.safeLoad(fs.readFileSync(this.configPath, "utf8"));
            if (settings && this.isWatching) {
                // test for withc package had changed and send event.
                // Object.keys(settings).forEach((key) => {
                //     if (settings && settings[key]) {
                //         console.log(key, settings[key]);
                //         if (JSON.stringify(this.settings[key]) !== JSON.stringify(settings[key])) {
                //             this.emit("reloadPackage", key);
                //         }
                //     }
                // });
            }
        } else {
            this.settings = {
                meta: {
                    version: "Haste 2.0",
                },
                toggleKeys: this.getToggleKeys(),
            };
            this.writeToFile(this.configPath, this.settings);
        }
        AppGlobal.settings = this.settings;
        console.log("settings loaded:", this.settings);
        this.isLoading = false;
    }

    private watchFile(): void {
        if (!this.isWatching && !this.isLoading) {
            this.isWatching = true;
            fs.watch(this.configPath, (event, path) => {
                if (!this.isLoading) {
                    this.isLoading = true;
                    console.log("Settings file " + event + " detected at ", path);
                    this.loadSettings();
                }
            });
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
            // this.watchFile();
        } catch (e) {
            console.error(e);
            throw new Error("Error loading config.yml file, check if exist or is valid Yaml format.");
        }
    }

    private writeToFile(path, data) {
        console.log("creating user config file...");
        mkdirp(Path.dirname(path), err => {
            if (err) {
                console.error("could not create path for user config file: " + path, err);
            } else {
                try {
                    fs.writeFileSync(path, yaml.safeDump(data));
                } catch (e) {
                    console.error("could not create user config file in: " + path, e);
                }
            }
        });
    }

    // public writeEntry(name: string, data: object): void {
    //     this.settings[name] = data;
    //     this.writeToFile();
    // }
    //
    // /**
    //  * this function will load the default pkg config that placed
    //  * in the package directory. if there already an entry in the main config
    //  * then it will use it and won't load the defaults.
    //  * @param pkgName
    //  * @param pkgPath
    //  */
    // public loadPkgConfig_deprecated(pkgName, pkgPath): any {
    //     let pkgConfig;
    //     if (this.getEntry(pkgName)) {
    //         console.log("Loading '" + pkgName + "' config from user config");
    //         return this.getEntry(pkgName);
    //     } else {
    //         console.log("Loading '" + pkgName + "' config from defaults");
    //         let defaultConfigPath = Path.join(__static, "packages/" + pkgName + "/defaultConfig.yml");
    //         defaultConfigPath = defaultConfigPath.replace(/\\/g, "/");
    //         try {
    //             pkgConfig = yaml.safeLoad(fs.readFileSync(defaultConfigPath, "utf8"));
    //             this.writeEntry(pkgName, pkgConfig);
    //         } catch (err) {
    //             console.error("Missing 'defaultConfig.yml' file for " + pkgName + " in " + defaultConfigPath, err);
    //             pkgConfig = {};
    //         }
    //     }
    //     return pkgConfig;
    // }
}
