var assert = require('assert')
const {app, clipboard} = require('electron');
/* global describe it */

describe('electron-mocha', function () {
    it('runs in main process by default', function () {
        assert.strictEqual(process.type, 'browser')
    });
    it('checks that calculator is working', () => {
        //const Calculator = require("../../src/main/packages/calculator/Calculator.ts");
        //let res = [];
        //res = Calculator.tryMathExpression(res, {value: "5+5"});
        //assert.equal(res[0].getPath(), 10);
    })
    it('checks that electron clipboard is working', () => {
        clipboard.writeText("save text");
        assert.equal(clipboard.readText(), "save text");
    })
})