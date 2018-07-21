import AbstractWindowController from "../controllers/AbstractWindowController";
import * as fs from "fs";
import * as Path from "path";
import {AppGlobal} from "typie-sdk";

export default class StyleLoader {

    private win: AbstractWindowController;
    private selectedThemePath: string;
    private themesPath: string;
    private themes: object;

    constructor(win) {
        this.win = win;
        this.selectedThemePath = AppGlobal.paths().getSelectedThemePath();
        this.themesPath = AppGlobal.paths().getThemesPath();
        this.themes = {};
    }

    public init(): void {
        console.log("sdf", this.selectedThemePath);
        this.loadStyle(this.selectedThemePath);
        fs.watch(this.themesPath, {recursive: true}, (event, filePath) => {
            const themeDir = Path.join(this.themesPath, Path.dirname(Path.normalize(filePath)));
            const newThemeStyle = Path.join(themeDir, "style.css");
            console.log("loading style form", newThemeStyle);
            if (fs.existsSync(newThemeStyle)) {
                console.log("loading style form", newThemeStyle);
                this.loadStyle(newThemeStyle);
            }
        });
    }

    public loadStyle(newThemeStyle): void {
        console.log("loading style form", newThemeStyle);
        fs.readFile(newThemeStyle, "utf8", (err, data) => {
            if (err) {
                console.error("did not found any default styles", err);
            } else {
                const theme = data.replace(/\n/g, "").replace(/\s\s+/g, " ");
                this.win.send("injectCss", theme);
            }
        });
    }
}
