var assert = require('assert')
const {app, clipboard} = require('electron');
/* global describe it */

describe('electron-mocha', function () {
    it('runs in main process by default', function () {
        assert.strictEqual(process.type, 'browser')
    });
    it('checks that 1 dose not equal 5', () => {
        assert.notEqual(1, 5);
    })
    it('checks that electron clipboard is working', () => {
        clipboard.writeText("save text");
        assert.equal(clipboard.readText(), "save text");
    })
})