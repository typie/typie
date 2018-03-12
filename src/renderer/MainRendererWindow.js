/**
 * just thinking out loud must find a better way to control the window from inside the renderer
 *
 * feel free to delete
 * */

const {ipcRenderer} = require('electron')

class MainWindow {
    constructor(win) {
        this.win = win
        this.visible = false
        this.mainVue
        this.position = win.getPosition()
    }

    setVue(mainVue) {
        this.mainVue = mainVue
    }

    show() {
        let self = this
        if (!self.visible) {
            self.win.setPosition(self.position[0], self.position[1]);
            // self.win.restore()
            self.win.show()
            self.visible = true
            /*setTimeout(function(){
             // self.win.show()

             // this.resize()
             },2000)*/
        }
    }

    hide() {
        let self = this
        if (self.visible) {
            self.position = self.win.getPosition()
            self.win.setPosition(5000, 5000);
            self.mainVue.$data.visible = false
            self.mainVue.$data.searchVal = ''
            self.mainVue.$data.selected = null
            self.mainVue.$data.package = self.mainVue.$data.defaultPackage
            //self.resize()
            setTimeout(function () {
                //self.win.minimize()
                self.win.hide()
                self.visible = false
            }, 20)
        }
    }

    toggle() {
        if (this.visible) {
            this.hide()
        } else {
            this.show()
        }
    }

    close() {
        this.hide()
        this.win.close()
    }

    send(channel, data) {
        this.win.webContents.send(channel, data)
    }

    focus() {
        if (document.getElementById('inputField')) {
            document.getElementById('inputField').focus()
        }
    }

    resize() {
        var _this = this
        setTimeout(function () {
            let h = document.getElementById('body').offsetHeight
            let w = document.getElementById('body').offsetWidth
            _this.win.setContentSize(w, h)
        }, 10)
    }

    registerEvents() {
        this.win.on('show', (e, cmd) => {
            this.focus()
            this.resize()
        })
        /* this.win.on('closed', () => {
         this.win = null
         })*/
        /* this.win.on('resize', function(e) {
         e.preventDefault()
         //console.log(e)
         //mainWindow.setContentSize(200, 200)
         })*/
    }

    registerListeningEvents() {
        ipcRenderer.on('addWorkers', (event, data) => {
            this.mainVue.$data.workers = this.mainVue.$data.workers + data
        })
        ipcRenderer.on('action', (event, data) => {
            switch (data) {
                case 'toggle':
                    this.toggle()
                    break
                case 'resize':
                    this.resize()
                    break
                case 'focus':
                    this.focus()
                    break
                case 'show':
                    this.show()
                    break
                case 'hide':
                    this.hide()
                    break
                case 'close':
                    this.close()
                    break
            }
        })
    }
}

module.exports = MainWindow
