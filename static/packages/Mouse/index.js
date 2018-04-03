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

    activate(item) {
        let doObj = {up: false, left: false, down: false, right: false};
        ioHook.on("keyup", event => {
            if ([23, 36, 37, 38].includes(event.keycode)) {
                switch (event.keycode) {
                    case 23: // UP
                        doObj.up = false;
                        break;
                    case 36: // LEFT
                        doObj.left = false;
                        break;
                    case 37: // Down
                        doObj.down = false;
                        break;
                    case 38: // Right
                        doObj.right = false;
                        break;
                }
            }
        });
        ioHook.on("keydown", event => {
            event.preventDefault;
            if ([23, 36, 37, 38].includes(event.keycode)) {
                switch (event.keycode) {
                    case 23: // UP
                        doObj.up = true;
                        break;
                    case 36: // LEFT
                        doObj.left = true;
                        break;
                    case 37: // Down
                        doObj.down = true;
                        break;
                    case 38: // Right
                        doObj.right = true;
                        break;
                }
            }
        });
        let amount = 5;
        setInterval(() => {
            if (doObj.up || doObj.left || doObj.down || doObj.right) {
                let pos = robot.getMousePos();
                let newX = pos.x;
                let newY = pos.y;

                if (doObj.up) {
                    newY -= amount;
                }
                if (doObj.left) {
                    newX -= amount;
                }
                if (doObj.down) {
                    newY += amount;
                }
                if (doObj.right) {
                    newX += amount;
                }
                robot.moveMouse(newX, newY);
            }
        }, 25);
        ioHook.start();
    }
}
module.exports = Mouse;

