
import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";
import {app} from "electron";
import AppGlobal from "../helpers/AppGlobal";

export default class Settings
{
    private settingsPath: string;
    private isLoading: boolean;
    private isWatching: boolean;
    private settings: object;

    constructor() {
        this.settings = {};
        this.settingsPath = path.join(app.getPath('userData'), 'config.yml');
        this.isLoading = true;
        this.isWatching = false;
        this.loadSettings();
    }

    private createIfNotExist(): void {
        let settings = {};
        if (fs.existsSync(this.settingsPath)) {
            console.log('Loading Settings File...');
            settings = yaml.safeLoad(fs.readFileSync(this.settingsPath, 'utf8'));
        } else {
            settings = {
                version: "Haste 2.0"
            };
            console.log('Creating New Settings File...');
            fs.writeFileSync(this.settingsPath, yaml.safeDump(settings));
        }
        this.settings = settings;
        AppGlobal.settings = this.settings;
        console.log('settings loaded:', this.settings);
        this.isLoading = false;
    }

    private watchFile(): void {
        if (!this.isWatching) {
            this.isWatching = true;
            fs.watch(this.settingsPath, (event, path) => {
                if (!this.isLoading) {
                    this.isLoading = true;
                    console.log('Settings file ' + event +' detected at ', path);
                    this.loadSettings();
                }
            });
        }
    }

    private loadSettings(): void {
        try {
            this.createIfNotExist();
            this.watchFile();
        } catch (e) {
            console.error(e);
            throw new Error('Error loading config.yml file, check if exist or is valid Yaml format.');
        }
    }
}