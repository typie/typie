import AbstractWindowController from "../controllers/AbstractWindowController";
declare const __static: any;
import * as fs from "fs";
import * as path from "path";


export default class StyleLoader
{
    private win: AbstractWindowController;
    private defaultThemePath: string;
    private themesPath: string;
    private themes: object;

    constructor(win) {
        this.win = win;
        this.defaultThemePath = 'default/style.css';
        this.themesPath = path.join(__static, '/themes/');
        this.themes = {};

        this.loadStyle(this.themesPath + this.defaultThemePath);

        fs.watch(this.themesPath, {recursive: true}, (event, filePath) => {
            let themeDir = path.join(this.themesPath, path.dirname(path.normalize(filePath)));
            let newThemeStyle = path.join(themeDir, 'style.css');
            if (fs.existsSync(newThemeStyle)) {
                this.loadStyle(newThemeStyle);
            }
        });
    }

    public loadStyle(newThemeStyle) {
        fs.readFile(newThemeStyle, 'utf8', (err, data) => {
            if (err) {
                console.error('did not found any default styles', err);
            } else {
                let theme = data.replace(/\n/g, '').replace(/\s\s+/g, ' ');
                this.win.send('injectCss', theme);
            }
        });
    }

    getDirectories(path) {
        return fs.readdirSync(path).filter(function (file) {
            return fs.statSync(path+'/'+file).isDirectory();
        });
    }
}