import {app, shell, Menu, Tray} from "electron";
import Path from "path";
import AppController from "../controllers/AppController";
import {AppGlobal} from "/@/services/sdk/index";

let tray;

export default class TrayBuilder {
    public static init() {
        tray = new Tray(Path.join(AppGlobal.paths().getSelectedThemeDir(), "images/icons/icon.png"));
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
            {
                checked: AppController.isStatupAtLoginOn(),
                label: "Start on login",
                type: "checkbox",
                click(event) { TrayBuilder.toggleStartup(event.checked); },
            },
            {type: "separator"},
            {role: "quit"},
        ]);

        tray.setContextMenu(contextMenu);
    }

    private static toggleStartup(checked): void {
        if (checked) {
            AppController.setStartOnStartup();
        } else {
            AppController.setDoNotStartOnStartup();
        }
    }
}
