const {globalShortcut} = require('electron');
const {AbstractHastePackage} = require('haste-sdk');
const ioHook = require('iohook');
const robot = require("robotjs");

class Mouse extends AbstractHastePackage
{

    constructor(Haste, win, config){
        super(win, config);

        this.haste       = new Haste(this.packageName);
        this.packageName = 'Mouse';

        this.intervalLoop = null;
        this.keys = {
            up: false, left: false, down: false, right: false,
            speed: false, click: false, rightClick: false,
        };

        // Example
        this.insert('Start Mouse Control <ESC for cancel>', "Press ESC to Exit");
    }

    activateUponEntry() {
        this.activate();
    }

    activate(item=null, cb=null) {
        globalShortcut.register('Esc', () => this.deactivate());
        globalShortcut.register('i', () => {});
        globalShortcut.register('j', () => {});
        globalShortcut.register('k', () => {});
        globalShortcut.register('l', () => {});
        globalShortcut.register('f', () => {});
        globalShortcut.register('d', () => {});
        globalShortcut.register('s', () => {});

        ioHook.on("keyup", event => this.getPressesObj(event, false));
        ioHook.on("keydown", event => this.getPressesObj(event, true));

        let keys = this.keys;
        this.intervalLoop = setInterval(() => {
            if (keys.up || keys.left || keys.down || keys.right) {
                let pos = robot.getMousePos();
                let newX = pos.x;
                let newY = pos.y;
                let amount = 7;
                if (keys.speed) {amount = 25}
                if (keys.up) {newY -= amount}
                if (keys.left) {newX -= amount}
                if (keys.down) {newY += amount}
                if (keys.right) {newX += amount}
                robot.moveMouse(newX, newY);
            }
        }, 10);
        ioHook.start();
    }

    getPressesObj(event, type) {
        let k = event.keycode;
        if ([23, 36, 37, 38, 32].includes(k)) {
            if (k === 23 && type !== this.keys.up) {this.keys.up = type}
            if (k === 36 && type !== this.keys.left) {this.keys.left = type}
            if (k === 37 && type !== this.keys.down) {this.keys.down = type}
            if (k === 38 && type !== this.keys.right) {this.keys.right = type}
            if (k === 32 && type !== this.keys.speed) {this.keys.speed = type}
        } else if ([33, 31].includes(k)) {
            if (k === 33 && type !== this.keys.click) {
                this.keys.click = type;
                if (type) { // f was clicked
                    robot.mouseToggle('down', 'left');
                } else { // f was released
                    robot.mouseToggle('up', 'left');
                }
            }
            if (k === 31 && type !== this.keys.rightClick) {
                this.keys.rightClick = type;
                if (type) { // f was clicked
                    robot.mouseToggle('down', 'right');
                } else { // f was released
                    robot.mouseToggle('up', 'right');
                }
            }
            //case 38: this.keys.doubleClick = type; break;
        }
    }

    deactivate() {
        ioHook.stop();
        globalShortcut.unregister('Esc');
        globalShortcut.unregister('i');
        globalShortcut.unregister('j');
        globalShortcut.unregister('k');
        globalShortcut.unregister('l');
        globalShortcut.unregister('f');
        globalShortcut.unregister('d');
        globalShortcut.unregister('s');
        this.keys = {
            up: false, left: false, down: false, right: false,
            speed: false, click: false, rightClick: false,
        };
        clearInterval(this.intervalLoop);
    }

    destroy() {
        this.deactivate();
    }
}
module.exports = Mouse;

