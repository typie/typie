const {globalShortcut} = require('electron');
const {AbstractHastePackage} = require('haste-sdk');
const ioHook = require('iohook');
const robot = require("robotjs");

class Mouse extends AbstractHastePackage
{

    constructor(win, config, pkgPath){
        super(win, config, pkgPath);
        this.packageName = 'Mouse';

        this.intervalLoop = null;
        this.keys = {
            up: false, left: false, down: false, right: false,
            speed: false, click: false, rightClick: false,
        };

        // Example
        this.insert('Start Mouse Control <ESC for cancel>', "Press ESC to Exit");

        this.moveArray = [
            keyToUnix(this.pkgConfig.keys.up),
            keyToUnix(this.pkgConfig.keys.left),
            keyToUnix(this.pkgConfig.keys.down),
            keyToUnix(this.pkgConfig.keys.right),
            keyToUnix(this.pkgConfig.keys.speed),
        ];
        this.actionArray = [
            keyToUnix(this.pkgConfig.keys.click),
            keyToUnix(this.pkgConfig.keys.rightClick),
        ]
    }

    activateUponEntry() {
        this.activate();
        this.win.hide();
    }

    activate(item=null, cb=null) {
        globalShortcut.register(this.pkgConfig.keys.escape, () => this.deactivate());
        globalShortcut.register(this.pkgConfig.keys.up, () => {});
        globalShortcut.register(this.pkgConfig.keys.left, () => {});
        globalShortcut.register(this.pkgConfig.keys.down, () => {});
        globalShortcut.register(this.pkgConfig.keys.right, () => {});
        globalShortcut.register(this.pkgConfig.keys.click, () => {});
        globalShortcut.register(this.pkgConfig.keys.speed, () => {});
        globalShortcut.register(this.pkgConfig.keys.rightClick, () => {});

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
        if (this.moveArray.includes(k)) {
            if (k === this.moveArray[0] && type !== this.keys.up) {this.keys.up = type}
            if (k === this.moveArray[1] && type !== this.keys.left) {this.keys.left = type}
            if (k === this.moveArray[2] && type !== this.keys.down) {this.keys.down = type}
            if (k === this.moveArray[3] && type !== this.keys.right) {this.keys.right = type}
            if (k === this.moveArray[4] && type !== this.keys.speed) {this.keys.speed = type}
        } else if (this.actionArray.includes(k)) {
            if (k === this.actionArray[0] && type !== this.keys.click) {
                this.keys.click = type;
                if (type) { // f was clicked
                    robot.mouseToggle('down', 'left');
                } else { // f was released
                    robot.mouseToggle('up', 'left');
                }
            }
            if (k === this.actionArray[1] && type !== this.keys.rightClick) {
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
        globalShortcut.unregister(this.pkgConfig.keys.escape);
        globalShortcut.unregister(this.pkgConfig.keys.up);
        globalShortcut.unregister(this.pkgConfig.keys.left);
        globalShortcut.unregister(this.pkgConfig.keys.down);
        globalShortcut.unregister(this.pkgConfig.keys.right);
        globalShortcut.unregister(this.pkgConfig.keys.click);
        globalShortcut.unregister(this.pkgConfig.keys.speed);
        globalShortcut.unregister(this.pkgConfig.keys.rightClick);
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


let keyToUnix = (key) => {
  return keyToUnixlist[key.toUpperCase()];
};
keyToUnixlist = {
    'ESC': 1,
    '1': 2,
    '2': 3,
    '3': 4,
    '4': 5,
    '5': 6,
    '6': 7,
    '7': 8,
    '8': 9,
    '9': 10,
    '0': 11,
    '-': 12,
    '=': 13,
    'BS': 14,
    'TAB': 15,
    'Q': 16,
    'W': 17,
    'E': 18,
    'R': 19,
    'T': 20,
    'Y': 21,
    'U': 22,
    'I': 23,
    'O': 24,
    'P': 25,
    '[': 26,
    ']': 27,
    'ENTER': 28,
    'L CTRL': 29,
    'A': 30,
    'S': 31,
    'D': 32,
    'F': 33,
    'G': 34,
    'H': 35,
    'J': 36,
    'K': 37,
    'L': 38,
    ';': 39,
    '`': 41,
    'L SHIFT': 42,
    '\\': 43,
    'Z': 44,
    'X': 45,
    'C': 46,
    'V': 47,
    'B': 48,
    'N': 49,
    'M': 50,
    ',': 51,
    '.': 52,
    //'/': 53,
    'R SHIFT': 54,
    '*': 55,
    'L ALT': 56,
    'SPACE': 57,
    'CAPS LOCK': 58,
    'F1': 59,
    'F2': 60,
    'F3': 61,
    'F4': 62,
    'F5': 63,
    'F6': 64,
    'F7': 65,
    'F8': 66,
    'F9': 67,
    'F10': 68,
    'NUM LOCK': 69,
    'SCROLL LOCK': 70,
    'HOME 7': 71,
    'UP 8': 72,
    'PGUP 9': 73,
    //'-': 74,
    'LEFT 4': 75,
    //'5': 76,
    'RT ARROW 6': 77,
    '#ERROR!': 78,
    'END 1': 79,
    'DOWN 2': 80,
    'PGDN 3': 81,
    'INS': 82,
    'DEL': 83,
    'F11': 87,
    'F12': 88,
    'R ENTER': 96,
    'R CTRL': 97,
    '/': 98,
    'PRT SCR': 99,
    'R ALT': 100,
    'Home': 102,
    'Up': 103,
    'PgUp': 104,
    'Left': 105,
    'Right': 106,
    'End': 107,
    'Down': 108,
    'PgDn': 109,
    'Insert': 110,
    'Del': 111,
    'Pause': 119,
};