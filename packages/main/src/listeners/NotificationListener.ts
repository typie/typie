import {globalShortcut} from "electron";
import type ConfigLoader from "../services/ConfigLoader";
import MainWindowController from "../controllers/MainWindowController";
import dgram from "node:dgram";
import type NotificationWindowController from "/@/controllers/NotificationWindowController";

export default class NotificationListener {

    private static nServer;

    public static listen(win: NotificationWindowController, config: ConfigLoader): void {
        NotificationListener.createNotificationServer(win);
        win.onWebContent("did-finish-load", () => {
            win.init();

            // @ts-ignore
            win.win?.maximize();
        });
        win.onWebContent("devtools-opened", () => win.setFocusAfterDevToolOpen());
    }

    private static createNotificationServer(win: NotificationWindowController) {
        this.nServer = dgram.createSocket("udp4");

        this.nServer.on("error", (err) => {
            console.error(`nServer error:\n${err.stack}`);
            this.nServer.close();
        });

        this.nServer.on("message", (buf, rinfo) => {
            const obj = buf.toString();
            // console.log(`nServer got: ${obj} from ${rinfo.address}:${rinfo.port}`, obj);
            win.send("notification", obj);
        });

        this.nServer.on("listening", () => {
            const address = this.nServer.address();
            console.log(`nServer listening ${address.address}:${address.port}`);
        });

        this.nServer.bind({
            address: "localhost",
            port: 41234,
            exclusive: false,
        });
    }
}
