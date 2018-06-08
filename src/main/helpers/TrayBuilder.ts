import {app, shell, Menu, Tray} from "electron";
import Path from "path";
declare const __static: any;

let tray;

export default class TrayBuilder {
    public static init() {
        tray = new Tray(Path.join(__static, "themes/default/images/icons/icon.png"));
        tray.setToolTip("This is my application.");
        const contextMenu = Menu.buildFromTemplate([
            {
                label: "About Typie",
                click() { shell.openExternal("https://github.com/typie/typie/wiki"); },
            },
            {
                label: "How to use",
                click() { shell.openExternal("https://github.com/typie/typie/wiki/How-to-use-Typie"); },
            },
            {type: "separator"},
            {role: "quit"},
        ]);

        tray.setContextMenu(contextMenu);
    }
}
