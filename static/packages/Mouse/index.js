const {shell, globalShortcut} = require('electron');
const skullIco = 'themes/default/images/skull.png';
const {AbstractHastePackage, HasteRowItem} = require('haste-sdk');
const ioHook = require('iohook');
const robot = require("robotjs");

class Mouse extends AbstractHastePackage
{

    constructor(Haste){
        super();
        this.packageName = 'Mouse';
        this.haste       = new Haste(this.packageName);
        this.icon        = 'skull.png';

        this.intervalLoop = null;
        this.keys = {up: false, left: false, down: false, right: false};

        // Example
        this.insert('start listen for keys');
    }

    insert(value) {
        let item = new HasteRowItem();
        item.title = value;
        item.description = "action";
        item.icon = skullIco;
        item.path = "";
        let res = this.haste.insert(item).go()
            .then((data) => console.log(data))
            .catch((err) => console.error(err));
    }

    search(value, callback){
        this.haste.fuzzySearch(value).orderBy('score').desc().go()
            .then(data => callback(data))
            .catch(err => console.error(err));
    }

    getPressesObj(event, type) {
        if ([23, 36, 37, 38].includes(event.keycode)) {
            switch (event.keycode) {
                case 23: this.keys.up = type; break;
                case 36: this.keys.left = type; break;
                case 37: this.keys.down = type; break;
                case 38: this.keys.right = type; break;
            }
        }
    }

    activate(item) {
        globalShortcut.register('Esc', () => this.deactivate());
        globalShortcut.register('i', () => {});
        globalShortcut.register('j', () => {});
        globalShortcut.register('k', () => {});
        globalShortcut.register('l', () => {});

        ioHook.on("keyup", event => this.getPressesObj(event, false));
        ioHook.on("keydown", event => this.getPressesObj(event, true));

        let amount = 5;
        let keys = this.keys;
        this.intervalLoop = setInterval(() => {
            if (keys.up || keys.left || keys.down || keys.right) {
                let pos = robot.getMousePos();
                let newX = pos.x;
                let newY = pos.y;

                if (keys.up) {
                    newY -= amount;
                }
                if (keys.left) {
                    newX -= amount;
                }
                if (keys.down) {
                    newY += amount;
                }
                if (keys.right) {
                    newX += amount;
                }
                robot.moveMouse(newX, newY);
            }
        }, 25);
        ioHook.start();
    }

    deactivate() {
        ioHook.stop();
        globalShortcut.unregister('Esc');
        globalShortcut.unregister('i');
        globalShortcut.unregister('j');
        globalShortcut.unregister('k');
        globalShortcut.unregister('l');
        this.keys = {up: false, left: false, down: false, right: false};
        clearInterval(this.intervalLoop);
    }
}
module.exports = Mouse;

