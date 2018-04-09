(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("haste-sdk", [], factory);
	else if(typeof exports === 'object')
		exports["haste-sdk"] = factory();
	else
		root["haste-sdk"] = factory();
})(global, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading wasm modules
/******/ 	var installedWasmModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// object with all compiled WebAssembly.Modules
/******/ 	__webpack_require__.w = {};
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../../../node_modules/gonode/lib/command.js":
/*!*********************************************************************!*\
  !*** C:/projects/electron-quick/node_modules/gonode/lib/command.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Copyright (c) 2013 John Granström\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\n// Commands must be executed within a command pool to limit execution count and time.\n\nvar misc = __webpack_require__(/*! ./misc */ \"../../../../node_modules/gonode/lib/misc.js\");\n\n// Create a command object with id, command, callback and optionally signal\nexports.Command = Command;\nfunction Command(id, cmd, callback, signal) {\n\t// Contain common data to be shared with go-module in .common\n\tthis.common = {\n\t\tid: id,\n\t\tcmd: cmd,\n\t\tsignal: signal === undefined ? -1: signal, // -1 is no signal\n\t}\n\t// Contain internal data not to be sent over the interface in .internal\n\tthis.internal = {\n\t\tcallback: callback,\n\t\texecutionStarted: false,\n\t\texecutionEnded: false,\n\t}\t\n}\n\n// Call to set the execution options for this command.\n// Default options will be added for those not provided\nCommand.prototype.setOptions = function(pool, options) {\n\tthis.internal.options = options || {};\n\tmisc.mergeDefaultOptions(this.internal.options, {\n\t\tcommandTimeoutSec: pool.go.options.defaultCommandTimeoutSec,\n\t});\n}\n\n// Execute command by sending it to go-module\nCommand.prototype.execute = function(pool, options) {\n\texecutionStarted(pool, this);\n\n\t// Send common data to go-module\n\tpool.go.proc.stdin.write(JSON.stringify(this.common) + '\\n'); // Write \\n to flush write buffer\t\n\n}\n\n// Handle command response and invoke callback\nCommand.prototype.response = function(pool, responseData) {\n\texecutionStopped(pool, this, responseData, {ok: true});\t\t\n}\n\n// Call if command reaches timeout, ends execution with timeout as result\nCommand.prototype.timeout = function(pool) {\n\texecutionStopped(pool, this, null, {timeout: true});\n}\n\n// Call if command is to be terminated, ends execution with terminated as result\nCommand.prototype.terminate = function(pool) {\n\texecutionStopped(pool, this, null, {terminated: true});\n}\n\n// Call each time the command is to be executed to update status\n// Handles the state of the command as well as the containing pool.\nfunction executionStarted(pool, cmd) {\n\tcmd.internal.executionStarted = true;\t\n\n\tpool.runningCommands++;\n\tpool.hasCommandsRunning = true;\n\n\t// Add executing command to map\n\tpool.commandMap[cmd.common.id] = cmd;\n\n\t// Only timeout non-signal commands\n\tif(cmd.common.signal === -1) {\n\t\tengageTimeout(pool, cmd);\n\t} \n}\n\n// Call each time the command has been received/timed out/aborted (stopped execution) to update pool status\n// Handles the state of the command as well as the containing pool.\nfunction executionStopped(pool, cmd, responseData, result) {\n\tif(!result.timeout) {\n\t\tclearTimeout(cmd.internal.timeout); // Stop timeout timer\n\t}\t\n\tcmd.internal.executionEnded = true;\n\n\tpool.runningCommands--;\n\tif(pool.runningCommands <= 0) {\n\t\tpool.runningCommands = 0; // To be safe\n\t\tpool.hasCommandsRunning = false;\n\t\tpool.enteredIdle(); // Pool is now idle\n\t}\n\n\t// Since command is now done we delete it from the commandMap\t\n\tdelete pool.commandMap[cmd.common.id];\n\tpool.workQueue(); // Will be added to event loop\n\n\t// Invoke callback last\n\tif(cmd.internal.callback !== undefined && cmd.internal.callback !== null) {\n\t\tvar responseResult = {\n\t\t\tok: result.ok === true,\n\t\t\ttimeout: result.timeout === true,\n\t\t\tterminated: result.terminated === true,\n\t\t}\n\t\tcmd.internal.callback(responseResult, responseData);\n\t}\n}\n\n// Activate timeout timer to abort commands running for too long\n// Calls executionStopped upon timeout.\nfunction engageTimeout(pool, cmd) {\n\tcmd.internal.timeout = setTimeout(function() {\t\t\n\t\t// Command timed out, abort execution\n\t\tcmd.timeout(pool);\n\t}, cmd.internal.options.commandTimeoutSec * 1000);\n}\n\n// Common signals\nexports.Signals = {\n\tTermination: new Command(0, null, null, 1),\n}\n\n//# sourceURL=webpack://haste-sdk/C:/projects/electron-quick/node_modules/gonode/lib/command.js?");

/***/ }),

/***/ "../../../../node_modules/gonode/lib/commandpool.js":
/*!*************************************************************************!*\
  !*** C:/projects/electron-quick/node_modules/gonode/lib/commandpool.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Copyright (c) 2013 John Granström\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\nconst commandIdLimit = 1e9;\n\nvar misc = __webpack_require__(/*! ./misc */ \"../../../../node_modules/gonode/lib/misc.js\"),\n\tQueue = __webpack_require__(/*! ./queue */ \"../../../../node_modules/gonode/lib/queue.js\").Queue,\t\n\tCommand = __webpack_require__(/*! ./command */ \"../../../../node_modules/gonode/lib/command.js\").Command;\n\nexports.CommandPool = CommandPool;\nfunction CommandPool(go) {\n\tthis.go = go;\n\tthis.commandMap = {},\n\tthis.nextCommandId = 0;\n\tthis.runningCommands = 0;\n\tthis.hasCommandsRunning = false;\n\n\tthis.idleCmdWaiting = null; // Provide the ability to execute a command upon next idle\n\t\n\tthis.commandQueue = new Queue();\n}\n\n// Plan the execution of a command and set execution options.\n// None prioritized commands may be queued instead of directly executed if exceeding command limit.\nCommandPool.prototype.planExecution = function(cmd, prioritized, options) {\n\tcmd.setOptions(this, options);\n\t// If command not prioritized make sure it does not exceed command limit\n\t//console.log(this.go.options.maxCommandsRunning)\t\n\texecuteCommand(this, cmd, prioritized);\n}\n\n// Handle JSON response and process command callback and end of execution \n// Also manage the queue if required. \nCommandPool.prototype.handleResponse = function(response) {\n\tvar respCmd = this.commandMap[response.id]\n\tif(respCmd !== undefined) {\n\t\trespCmd.response(this, response.data);\t\n\t} else {\n\t\t// Command may have timed out or otherwise aborted so we throw the response away\n\t}\t\n}\n\n// Create a command with specified data and callback with new ID\nCommandPool.prototype.createCommand = function(data, callback) {\n\tcmd = new Command(this.nextCommandId, data, callback);\n\tincrementCommandId(this);\n\treturn cmd;\n}\n\n// Check if commands are queued, and if so execute them on next event loop\nCommandPool.prototype.workQueue = function() {\n\tif(!this.commandQueue.isEmpty()) { // Check if queue is empty first\n\t\tvar pool = this;\n\t\t// Dequeue command here not on nextTick() to avoid multiple dequeues for same item\n\t\tvar nextCmd = pool.commandQueue.dequeue();\n\t\tprocess.nextTick(function() { // Execute next commands on next tick\n\t\t\texecuteCommand(pool, nextCmd, false);\n\t\t});\n\t}\n}\n\n// Plan a single command to be run the next time the command pool is idle\n// (no running commands). Calling this several times without having an idle period\n// will overwrite any previously planned on idle commands\nCommandPool.prototype.planOnIdle = function(cmd, prioritized, options) {\n\tthis.idleCmdWaiting = {\n\t\tcmd: cmd,\n\t\tprioritized: prioritized,\n\t\toptios: options,\n\t};\n\t// If there's no commands running, execute it right away\n\tif(!this.hasCommandsRunning) {\n\t\texecuteWaitingCommand(this);\n\t}\n}\n\n// Call when pool has entered idle, i.e. has no commands running as of now\nCommandPool.prototype.enteredIdle = function() {\n\t// Check if there's a command waiting for idle\n\tif(this.idleCmdWaiting != null) {\n\t\t// Execute waiting command on next tick\n\t\tvar self = this;\n\t\tprocess.nextTick(function() {\n\t\t\texecuteWaitingCommand(self);\n\t\t});\n\t}\n}\n\n// Causes all running commands to timeout\nCommandPool.prototype.terminate = function() {\n\tthis.commandQueue.clear(); // Clear command queue\n\tthis.idleCmdWaiting = null; // Throw away any waiting command\n\n\tfor(var cmdId in this.commandMap) {\n\t\tvar cmd = this.commandMap[cmdId];\n\t\tif(cmd.internal.executionStarted && !cmd.internal.executionEnded) {\n\t\t\tcmd.terminate(this);\n\t\t}\n\t}\n}\n\n// Execute a command if does not exceed command count limit and command queue is empty\n// otherwise queue command for later execution.\nfunction executeCommand(pool, cmd, prioritized) {\n\tif(!prioritized && (pool.runningCommands >= pool.go.options.maxCommandsRunning)) {\n\t\t// Exceeds limit, queue command instead of running\n\t\tpool.commandQueue.enqueue(cmd);\n\t} else {\n\t\t// Execute command\t\n\t\tcmd.execute(pool);\t\n\t}\n}\n\n// Reset nextCommandId if growing past limit\n// Limit should be set high enough so that the old command for ID 0\n// most likely has responded or timed out and will not conflict with new ones.\nfunction incrementCommandId(pool) {\n\tif(pool.nextCommandId++ >= commandIdLimit) {\n\t\tpool.nextCommandId = 0;\n\t}\n}\n\n// Execute a command planned to run on next idle\nfunction executeWaitingCommand(pool) {\n\tvar toExecute = pool.idleCmdWaiting;\n\tpool.idleCmdWaiting = null;\n\tpool.planExecution(toExecute.cmd,\n\t\ttoExecute.prioritized,\n\t\ttoExecute.options\n\t);\n}\n\n//# sourceURL=webpack://haste-sdk/C:/projects/electron-quick/node_modules/gonode/lib/commandpool.js?");

/***/ }),

/***/ "../../../../node_modules/gonode/lib/gonode.js":
/*!********************************************************************!*\
  !*** C:/projects/electron-quick/node_modules/gonode/lib/gonode.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Copyright (c) 2013 John Granström\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\nvar spawn = __webpack_require__(/*! child_process */ \"child_process\").spawn,\n\tutil = __webpack_require__(/*! util */ \"util\"),\n\tfs = __webpack_require__(/*! fs */ \"fs\"),\t\n\tmisc = __webpack_require__(/*! ./misc */ \"../../../../node_modules/gonode/lib/misc.js\"),\n\tEventEmitter = __webpack_require__(/*! events */ \"events\").EventEmitter,\n\tCommandPool = __webpack_require__(/*! ./commandpool */ \"../../../../node_modules/gonode/lib/commandpool.js\").CommandPool\t\n\tSignals = __webpack_require__(/*! ./command */ \"../../../../node_modules/gonode/lib/command.js\").Signals;\n\n// Create a new Go-object for the specified .go-file.\n// Will also intialize Go-object if second parameter is true.\n//\n// Throws error if no path provided to .go-file.\nutil.inherits(Go, EventEmitter);\nexports.Go = Go;\nfunction Go(options, callback) {\n\tif(options === undefined || options === null) {\n\t\tmisc.raiseError('No options provided.')\n\t}\n\tif(options.path == undefined || options.path == null) {\n\t\tmisc.raiseError('No path provided to .go-file.');\n\t}\n\n\tmisc.mergeDefaultOptions(options, {\n\t\tmaxCommandsRunning: 10,\n\t\tdefaultCommandTimeoutSec: 5,\n\t\tcwd: process.cwd(),\n\t});\n\tthis.options = options;\n\n\tthis.goFile = options.path;\n\tthis.proc = null;\n\tthis.initialized = false; // true when Go has been initialized, back to false when Go closes\n\tthis.closePending = false; // true when close() has been called and no more commands should be planned\n\tthis.terminatePending = false; // true when terminate() has been called\n\tthis.commandPool = new CommandPool(this)\n\n\tif(options.initAtOnce) {\n\t\tthis.init(callback);\n\t}\n}\n\n// Initialize by launching go process and prepare for commands.\n// Do as early as possible to avoid delay when executing first command.\n//\n// callback has parameters (err)\nGo.prototype.init = function(callback) {\t\t\n\tvar self = this;\n\tfs.exists(this.goFile, function(exists) {\n\t\tif(!exists) {\t\n\t\t\tmisc.callbackIfAvailable(callback, misc.getError('.go-file not found for given path.'));\n\t\t\treturn;\n\t\t}\n\n\t\t// simple extension check to detect if its a un compiles .go file\n\t\tif (self.goFile.slice(-3).toLowerCase() === '.go') {\n\t\t\t// Spawn go process within current working directory\n\t\t\tself.proc = spawn('go', ['run', self.goFile], { cwd: self.options.cwd, env: process.env });\n\t\t} else {\n\t\t\t// Spawn go compiled file\n\t\t\tself.proc = spawn( self.goFile, [], { cwd: self.options.cwd, env: process.env });\n\t\t}\n\n\n\t\t// Setup handlers\n\t\tself.proc.stdout.on('data', function(data){\n\t\t\thandleStdout(self, data);\n\t\t});\n\t\tself.proc.stderr.on('data', function(data){\n\t\t\thandleErr(self, data, false);\n\t\t});\n\t\tself.proc.on('close', function(){\n\t\t\thandleClose(self);\n\t\t});\t\t\n\n\t\t// Init complete\n\t\tself.initialized = true;\n\t\tmisc.callbackIfAvailable(callback, null);\n\t});\n}\n\n// Gracefully close Go by sending termination signal after all executing commands\n// has ended their execution.\n// Returns true if close has been started, or false if Go is not initialized or if it\n// already has a close pending.\nGo.prototype.close = function() {\n\tif(this.initialized && !this.closePending && !this.terminatePending) {\n\t\tthis.closePending = true;\n\t\t// Send prioritized termination signal\n\t\tthis.commandPool.planOnIdle(Signals.Termination, true);\n\n\t\treturn true;\n\t} else {\n\t\treturn false;\n\t}\n}\n\n// Hard terminate by sending termination on all commands and termination signal to Go\n// Returns true if termination has been started, or false if Go is not initialized or if it\n// already has a termination pending.\nGo.prototype.terminate = function() {\n\treturn terminate(this, true);\n}\n\n// Create and execute or queue a command of JSON data\n// Will not queue command if Go is not initialized or has been closed (or close pending)\n// Takes parameters:\n// \t\tdata (required) - actual command JSON\n//\t\tcallback (required) - the callback to call with possible result when execution ends\n//\t\toptions (optional) - overrides default execution options\n// Returns true if the command was planned for execution, otherwise false.\nGo.prototype.execute = function(data, callback, options) {\t\n\tif(this.initialized && !this.closePending && !this.terminatePending) {\n\t\t// Important to not leave go in an infinite loop eatig cpu\n\t\ttry { // Contain outer exceptions and close go before rethrowing exception.\n\t\t\tthis.commandPool.planExecution(this.commandPool.createCommand(data, callback), false, options);\t\n\t\t} catch (e) {\n\t\t\thandleErr(this, e, false);\n\t\t}\n\t\treturn true; // Return true since the command has been planned for execution\n\t} else {\n\t\treturn false; // The command wasn't planned for execution, return false\n\t}\n}\n\n// Receive data from go-module\nfunction handleStdout(go, data) {\t\n\t// Response may be several command responses separated by new lines\n\tdata.toString().split(\"\\n\").forEach(function(resp) {\n\t\t// Discard empty lines\n\t\tif(resp.length > 0) {\n\t\t\t// Parse each command response with a event-loop in between to avoid blocking\n\t\t\tprocess.nextTick(function(){parseResponse(go, resp)});\n\t\t}\t\t\n\t});\n}\n\n// Parse a _single_ command response as JSON and handle it\n// If parsing fails a internal error event will be emitted with the response data\nfunction parseResponse(go, resp) {\n\tvar parsed;\n\ttry {\n\t\tparsed = JSON.parse(resp);\n\t} catch (e) {\t\t\n\t\thandleErr(go, resp, true);\n\t\treturn;\n\t}\n\n\t// Important to not leave go in an infinite loop eatig cpu\n\ttry { // Contain outer exceptions and close go before rethrowing exception.\n\t\tgo.commandPool.handleResponse(parsed) // Handle response outside throw to avoid catching those exceptions\t\n\t} catch (e) {\n\t\thandleErr(go, e, false);\n\t}\t\n}\n\n// Emit error event on go instance, pass through raw error data\n// Errors may either be internal parser errors or external errors received from stderr\nfunction handleErr(go, data, parser) {\t\n\tif(!parser) { // If external error, terminate all commands\n\t\tterminate(go, false);\n\t}\n\n\tif(go.listeners('error').length > 0) { // Only emit event if there are listeners\n\t\tprocess.nextTick(function() {\n\t\t\t// Emit any event on next tick\n\t\t\tgo.emit('error', {parser: parser, data: data});\n\t\t});\n\t}\t\n}\n\n// Go panic and process ends causes calls to this\n// Emit close event on go instance\nfunction handleClose(go) {\n\t// If process closes we set initialized to false to avoid invalid close() or execute()\t\n\tgo.initialized = false;\n\tif(go.listeners('close').length > 0) { // Only emit event if there are listeners\n\t\tgo.emit('close');\n\t}\t\t\n}\n\n// Terminate by sending termination on all commands.\n// If called with true it will also directly try to send a termination signal to go\nfunction terminate(go, withSignal) {\n\tif(go.initialized && !go.terminatePending) {\n\t\tgo.terminatePending = true;\n\n\t\t// Do the actual termination asynchronously\n\t\t// Callbacks will be each terminated command or nothing\n\t\tprocess.nextTick(function(){\n\t\t\t// Tell command pool to kill all commands\n\t\t\tgo.commandPool.terminate();\t\t\t\n\n\t\t\t// Send signal after command pool termination, otherwise it would\n\t\t\t// be removed by terminate()\n\t\t\tif(withSignal) {\t\t\t\t\t\n\t\t\t\tgo.commandPool.planExecution(Signals.Termination, true);\t\t\t\t\n\t\t\t}\n\t\t});\n\n\t\treturn true;\n\t} else {\n\t\treturn false;\n\t}\t\n}\n\n//# sourceURL=webpack://haste-sdk/C:/projects/electron-quick/node_modules/gonode/lib/gonode.js?");

/***/ }),

/***/ "../../../../node_modules/gonode/lib/misc.js":
/*!******************************************************************!*\
  !*** C:/projects/electron-quick/node_modules/gonode/lib/misc.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// Copyright (c) 2013 John Granström\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\n// Contains general helpers\n\n// Invoke callback if not undefined with provided parameter\nexports.callbackIfAvailable = function(callback, param) {\n\tif(typeof callback != undefined) {\n\t\tcallback(param);\n\t}\n}\n\nexports.raiseError = function(error) {\n\tthrow getError(error);\n}\n\nexports.getError = function(error) {\n\treturn new Error('gonode: ' + error);\n}\n\n// Make sure options not provided are set to default values \nexports.mergeDefaultOptions = function(options, defaults) {\n\tfor (opt in defaults) {\n\t\tif(options[opt] === undefined) {\n\t\t\toptions[opt] = defaults[opt];\n\t\t} \n\t}\n}\n\n//# sourceURL=webpack://haste-sdk/C:/projects/electron-quick/node_modules/gonode/lib/misc.js?");

/***/ }),

/***/ "../../../../node_modules/gonode/lib/queue.js":
/*!*******************************************************************!*\
  !*** C:/projects/electron-quick/node_modules/gonode/lib/queue.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// Copyright (c) 2013 John Granström\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\nexports.Queue = Queue;\nfunction Queue() {\n\tthis.arr = [];\n}\n\nQueue.prototype.enqueue = function(element) {\n\tthis.arr.push(element);\n}\n\nQueue.prototype.dequeue = function() {\n\treturn this.arr.shift();\n}\n\nQueue.prototype.getLength = function() {\n\treturn this.arr.length;\n}\n\nQueue.prototype.isEmpty = function() {\n\treturn this.getLength() === 0;\n}\n\nQueue.prototype.clear = function() {\n\tthis.arr.length = 0;\n}\n\n//# sourceURL=webpack://haste-sdk/C:/projects/electron-quick/node_modules/gonode/lib/queue.js?");

/***/ }),

/***/ "./src/AbstractHastePackage.ts":
/*!*************************************!*\
  !*** ./src/AbstractHastePackage.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(__dirname) {\nObject.defineProperty(exports, \"__esModule\", { value: true });\n//const MainWindowController = require(\"../controllers/MainWindowController\");\n//const {HastePackageInterface} = require(\"./models/HastePackageInterface\");\nconst HasteRowItem_1 = __webpack_require__(/*! ./models/HasteRowItem */ \"./src/models/HasteRowItem.ts\");\nconst Path = __webpack_require__(/*! path */ \"path\");\nconst defaultIcon = 'pkg-icon.png';\nclass AbstractHastePackage {\n    constructor(win, config, pkgPath) {\n        this.win = win;\n        this.packageData = { name: this.constructor.name, path: __dirname };\n        this.packageName = this.constructor.name;\n        this.pkgConfig = config;\n        this.packagePath = pkgPath;\n        this.icon = Path.join(this.packagePath, defaultIcon);\n        /**\n         * @type {Haste}\n         */\n        this.haste = null;\n        this.loadConfig();\n    }\n    getPackageName() {\n        return this.packageName;\n    }\n    getDefaultItem(value, description = \"\", path = \"\", icon = \"\") {\n        let item = new HasteRowItem_1.default();\n        item.setTitle(value);\n        item.setPath(path ? path : value);\n        item.setIcon(icon ? icon : this.icon);\n        item.setDescription(description ? description : \"\");\n        return item;\n    }\n    insert(value, description = \"\", path = \"\", icon = \"\") {\n        this.insertItem(this.getDefaultItem(value, description, path, icon));\n    }\n    insertItem(item) {\n        this.haste.insert(item).go()\n            .then(data => console.log(data))\n            .catch(err => console.error(err));\n    }\n    search(searchObj, callback) {\n        this.haste.fuzzySearch(searchObj.value).orderBy('score').desc().go()\n            .then(data => callback(data))\n            .catch(err => console.log(err));\n    }\n    activate(rowItem, callback) { console.error('No override \"action\" method found in ' + this.packageName); }\n    //remove(rowItem: HasteRowItem, callback: Function) {console.error('No override \"remove\" method found in ' + this.packageName)}\n    activateUponEntry() {\n        console.log(\"No override 'activateUponEntry' method found in \" + this.packageName);\n    }\n    getIcon(icon) {\n        return Path.join(this.packagePath, icon);\n    }\n    loadConfig() {\n        //console.log(\"No override 'loadConfig' method found in \" + this.packageName);\n        if (this.pkgConfig.shortcut) {\n            console.log('registering shortcut ' + this.pkgConfig.shortcut + ' to ' + this.getPackageName());\n            this.win.registerKey(this.pkgConfig.shortcut, () => {\n                this.win.send('changePackage', [this.getPackageName()]);\n                this.activateUponEntry();\n            });\n        }\n    }\n    destroy() {\n        console.log('destroying the package!');\n        console.log('unregister', this.pkgConfig);\n        if (this.pkgConfig.shortcut) {\n            this.win.unregisterKey(this.pkgConfig.shortcut);\n        }\n    }\n}\nexports.default = AbstractHastePackage;\n\n/* WEBPACK VAR INJECTION */}.call(this, \"/\"))\n\n//# sourceURL=webpack://haste-sdk/./src/AbstractHastePackage.ts?");

/***/ }),

/***/ "./src/GoDispatcher.ts":
/*!*****************************!*\
  !*** ./src/GoDispatcher.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst gonode_1 = __webpack_require__(/*! gonode */ \"../../../../node_modules/gonode/lib/gonode.js\");\nclass GoDispatcher {\n    static startListen() {\n        console.log('Starting Haste Service');\n        //GoDispatcher.go = new Go({path: \"C:\\\\projects\\\\Go\\\\src\\\\haste\\\\main.go\"});\n        GoDispatcher.go = new gonode_1.Go({\n            path: \"C:\\\\projects\\\\Go\\\\src\\\\haste\\\\haste.exe\",\n            //path: path.normalize(\"/Users/rotemgrimberg/go/src/haste-go/haste-go\"),\n            defaultCommandTimeoutSec: 60,\n            maxCommandsRunning: 10,\n        });\n        //GoDispatcher.go = new Go({path: \"static/bin/haste/haste-go\"});\n        //GoDispatcher.go = new Go({path: path.normalize(\"/Users/rotemgrimberg/go/src/haste-go/haste-go\")});\n        GoDispatcher.go.init(this.register); // We must always initialize gonode before executing any commands\n    }\n    static send(packet) {\n        //let sendTime = Date.now();\n        //console.log('packet', packet);\n        return new Promise((resolve, reject) => {\n            GoDispatcher.go.execute(packet, (result, response) => {\n                //console.log('got back', response);\n                if (result.ok) {\n                    //console.log('golang time: ', Date.now() - sendTime);\n                    if (response.data) {\n                        response.data = JSON.parse(response.data);\n                    }\n                    return resolve(response);\n                }\n                return reject(response);\n            });\n        });\n    }\n    static close() {\n        GoDispatcher.go.close();\n        GoDispatcher.listening = false;\n    }\n    static register() {\n        GoDispatcher.go.execute({ command: 'start' }, (result, response) => {\n            if (result.ok) { // Check if response is ok\n                // In our case we just echo the command, so we can get our text back\n                console.log('Haste responded: ', response);\n                if (response.err == 0) {\n                    GoDispatcher.listening = true;\n                }\n            }\n        });\n    }\n}\nGoDispatcher.listening = false;\nexports.default = GoDispatcher;\n\n\n//# sourceURL=webpack://haste-sdk/./src/GoDispatcher.ts?");

/***/ }),

/***/ "./src/Haste.ts":
/*!**********************!*\
  !*** ./src/Haste.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst GoDispatcher_1 = __webpack_require__(/*! ./GoDispatcher */ \"./src/GoDispatcher.ts\");\nconst Packet_1 = __webpack_require__(/*! ./models/Packet */ \"./src/models/Packet.ts\");\nconst SearchPayload_1 = __webpack_require__(/*! ./models/SearchPayload */ \"./src/models/SearchPayload.ts\");\nclass Haste {\n    constructor(packageName, db) {\n        this._search = new SearchPayload_1.default;\n        this.db = db ? db : packageName;\n        this.packageName = packageName;\n        this.command = '';\n        this.payload = {};\n    }\n    pasteText() {\n        this.command = 'pasteText';\n        this.payload = {};\n        return this;\n    }\n    addCollection() {\n        this.command = 'addCollection';\n        this.payload = { name: this.packageName };\n        return this;\n    }\n    updateCalled(item) {\n        item.countUp();\n        return this.insert(item, true);\n    }\n    multipleInsert(itemList) {\n        this.command = 'multipleInsert';\n        this.payload = itemList;\n        return this;\n    }\n    insert(item, persist = true) {\n        item.setDB(this.db);\n        item.setPackage(this.packageName);\n        this.command = persist ? 'insertPersist' : 'insert';\n        this.payload = item.toPayload();\n        return this;\n    }\n    getKey(value) {\n        this.payload.value = value;\n        this.payload.db = this.db;\n        this.payload.packageName = this.packageName;\n        this.command = 'getKey';\n        return this;\n    }\n    getExecList() {\n        this.payload.db = this.db;\n        this.payload.packageName = this.packageName;\n        this.command = 'getExecList';\n        return this;\n    }\n    fuzzySearch(value) {\n        this._search.value = value;\n        this._search.type = 'fuzzy';\n        this._search.db = this.db;\n        this._search.packageName = this.packageName;\n        this.command = 'search';\n        this.payload = this._search;\n        return this;\n    }\n    getRows(limit) {\n        this._search.limit = limit;\n        this._search.type = 'getRows';\n        this._search.db = this.db;\n        this._search.packageName = this.packageName;\n        this.command = 'search';\n        this.payload = this._search;\n        return this;\n    }\n    orderBy(field) {\n        this._search.direction = 'asc';\n        this._search.orderBy = field;\n        return this;\n    }\n    asc() {\n        this._search.direction = 'asc';\n        return this;\n    }\n    desc() {\n        this._search.direction = 'desc';\n        return this;\n    }\n    go() {\n        let packet = new Packet_1.default(this.command, this.payload);\n        return GoDispatcher_1.default.send(packet);\n    }\n    mouse() {\n        return {\n            up() {\n                GoDispatcher_1.default.send(new Packet_1.default(\"mouseMovement\", { direction: \"up\" })).then().catch();\n            },\n            down() {\n                GoDispatcher_1.default.send(new Packet_1.default(\"mouseMovement\", { direction: \"down\" })).then().catch();\n            },\n            left() {\n                GoDispatcher_1.default.send(new Packet_1.default(\"mouseMovement\", { direction: \"left\" })).then().catch();\n            },\n            right() {\n                GoDispatcher_1.default.send(new Packet_1.default(\"mouseMovement\", { direction: \"right\" })).then().catch();\n            }\n        };\n    }\n}\nexports.default = Haste;\n\n\n//# sourceURL=webpack://haste-sdk/./src/Haste.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst AbstractHastePackage_1 = __webpack_require__(/*! ./AbstractHastePackage */ \"./src/AbstractHastePackage.ts\");\nexports.AbstractHastePackage = AbstractHastePackage_1.default;\nconst HasteRowItem_1 = __webpack_require__(/*! ./models/HasteRowItem */ \"./src/models/HasteRowItem.ts\");\nexports.HasteRowItem = HasteRowItem_1.default;\nconst SearchObject_1 = __webpack_require__(/*! ./models/SearchObject */ \"./src/models/SearchObject.ts\");\nexports.SearchObject = SearchObject_1.default;\nconst GoDispatcher_1 = __webpack_require__(/*! ./GoDispatcher */ \"./src/GoDispatcher.ts\");\nexports.GoDispatcher = GoDispatcher_1.default;\nconst Haste_1 = __webpack_require__(/*! ./Haste */ \"./src/Haste.ts\");\nexports.Haste = Haste_1.default;\n\n\n//# sourceURL=webpack://haste-sdk/./src/index.ts?");

/***/ }),

/***/ "./src/models/HasteRowItem.ts":
/*!************************************!*\
  !*** ./src/models/HasteRowItem.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nclass HasteRowItem {\n    constructor(title) {\n        this.db = \"\";\n        this.d = \"\";\n        this.i = \"\";\n        this.t = \"\";\n        this.p = \"\";\n        this.title = title ? title : \"\";\n        this.c = 0;\n    }\n    setTitle(value) {\n        this.title = value;\n    }\n    getTitle() {\n        return this.title;\n    }\n    setPath(value) {\n        this.p = value;\n    }\n    getPath() {\n        return this.p;\n    }\n    setDB(value) {\n        this.db = value;\n    }\n    getDB() {\n        return this.db;\n    }\n    setDescription(value) {\n        this.d = value ? value : \"\";\n    }\n    getDescription() {\n        return this.d;\n    }\n    setIcon(value) {\n        this.i = value;\n    }\n    getIcon() {\n        return this.i;\n    }\n    setPackage(value) {\n        this.t = value;\n    }\n    getPackage() {\n        return this.t;\n    }\n    setCount(value) {\n        this.c = value;\n    }\n    getCount() {\n        return this.c;\n    }\n    countUp() {\n        this.c = this.c + 1;\n    }\n    setUnixtime(value) {\n        this.u = value;\n    }\n    getUnixtime() {\n        return this.u;\n    }\n    setScore(value) {\n        this.score = value;\n    }\n    getScore() {\n        return this.score;\n    }\n    static create(data) {\n        let item = new HasteRowItem();\n        item.setDB(data.db);\n        item.setPackage(data.t);\n        item.setTitle(data.title);\n        item.setPath(data.p);\n        item.setDescription(data.d);\n        item.setIcon(data.i);\n        item.setCount(data.c);\n        item.setScore(data.score);\n        item.setUnixtime(data.u);\n        return item;\n    }\n    toPayload() {\n        return {\n            db: this.getDB(),\n            t: this.getPackage(),\n            title: this.getTitle(),\n            p: this.getPath(),\n            d: this.getDescription(),\n            i: this.getIcon(),\n            c: this.getCount(),\n        };\n    }\n}\nexports.default = HasteRowItem;\n\n\n//# sourceURL=webpack://haste-sdk/./src/models/HasteRowItem.ts?");

/***/ }),

/***/ "./src/models/Packet.ts":
/*!******************************!*\
  !*** ./src/models/Packet.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nclass Packet {\n    constructor(command, payload) {\n        this.command = '';\n        this.payload = {};\n        this.command = command;\n        this.payload = payload ? payload : {};\n    }\n}\nexports.default = Packet;\n\n\n//# sourceURL=webpack://haste-sdk/./src/models/Packet.ts?");

/***/ }),

/***/ "./src/models/SearchObject.ts":
/*!************************************!*\
  !*** ./src/models/SearchObject.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nclass SearchObject {\n    constructor() {\n        this.value = '';\n        this.pkgList = [];\n    }\n}\nexports.default = SearchObject;\n\n\n//# sourceURL=webpack://haste-sdk/./src/models/SearchObject.ts?");

/***/ }),

/***/ "./src/models/SearchPayload.ts":
/*!*************************************!*\
  !*** ./src/models/SearchPayload.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nclass SearchPayload {\n    constructor() {\n        this.type = 'fuzzy'; // can be 'fuzzy' | '' |\n        this.limit = 10;\n        this.value = ''; // the actual search valu\n        this.orderBy = 'score'; // the name of the field to be ordered by\n        this.direction = 'desc';\n        this.packageName = '';\n        this.db = '';\n    }\n}\nexports.default = SearchPayload;\n\n\n//# sourceURL=webpack://haste-sdk/./src/models/SearchPayload.ts?");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"child_process\");\n\n//# sourceURL=webpack://haste-sdk/external_%22child_process%22?");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"events\");\n\n//# sourceURL=webpack://haste-sdk/external_%22events%22?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack://haste-sdk/external_%22fs%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack://haste-sdk/external_%22path%22?");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"util\");\n\n//# sourceURL=webpack://haste-sdk/external_%22util%22?");

/***/ })

/******/ });
});