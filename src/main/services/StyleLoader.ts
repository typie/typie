import AbstractWindowController from "../controllers/AbstractWindowController";
declare const __static: any;
import * as fs from "fs";
import * as Path from "path";

export default class StyleLoader {

    private win: AbstractWindowController;
    private defaultThemePath: string;
    private themesPath: string;
    private themes: object;

    constructor(win) {
        this.win = win;
        this.defaultThemePath = "default/style.css";
        this.themesPath = Path.join(__static, "/themes/");
        this.themes = {};
    }

    public init(): void {
        this.loadStyle(this.themesPath + this.defaultThemePath);
        fs.watch(this.themesPath, {recursive: true}, (event, filePath) => {
            const themeDir = Path.join(this.themesPath, Path.dirname(Path.normalize(filePath)));
            const newThemeStyle = Path.join(themeDir, "style.css");
            if (fs.existsSync(newThemeStyle)) {
                this.loadStyle(newThemeStyle);
            }
        });
    }

    public loadStyle(newThemeStyle): void {
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
