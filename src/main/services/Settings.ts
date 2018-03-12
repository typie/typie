
import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";
import {app} from "electron";
import AppGlobal from "../helpers/AppGlobal";

export default class Settings
{
    private static settingsPath: string = path.join(app.getPath('userData'), 'config.yml');
    private static isLoading: boolean = false;
    private static isWatching: boolean = false;

    public static init(): void {
        try {
            this.createIfNotExist();
            this.watchFile();
        } catch (e) {
            console.error(e);
            throw new Error('Error loading config.yml file, check if exist or is valid Yaml format.');
        }
    }

    private static createIfNotExist(): void {
        if (fs.existsSync(this.settingsPath)) {
            console.log('Loading Settings File...');
            let settings = yaml.safeLoad(fs.readFileSync(this.settingsPath, 'utf8'));
            console.log(settings);
            AppGlobal.settings = settings;
        } else {
            let defaultSettings = {
                test: "some test"
            };
            console.log('Creating New Settings File...');
            fs.writeFileSync(this.settingsPath, yaml.safeDump(defaultSettings));
        }
    }

    private static watchFile(): void {
        if (!this.isWatching) {
            this.isWatching = true;
            fs.watch(this.settingsPath, (event, path) => {
                if (!this.isLoading) {
                    this.isLoading = true;
                    console.log('Settings file ' + event +' detected at ', path);
                    setTimeout(() => this.isLoading = false, 25);
                    this.init();
                }
            });
        }
    }
}