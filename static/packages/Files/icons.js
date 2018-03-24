const {execFile} = require('child_process');
// const app      = require('electron').remote.app
const fs = require('fs');
const path = require('path');
const pathAbs = require('./path-absolute');
const executablePath = path.join(__dirname, './lnk_parser_cmd.exe');

exports.queryLnk = function (filePath, callback) {
  execFile(executablePath, [filePath], function (error, stdout, stderr) {
    let parsed = parseLNKString(stdout)
    if (error) {
      // console.log(error)
      console.log(error)
      callback(error, filePath)
    } else if (parsed['String Data'] !== undefined && parsed['String Data']['Relative path (UNICODE)'] !== undefined) {
      let relativePath = path.normalize(parsed['String Data']['Relative path (UNICODE)'])
      let newFilePath = path.join(path.dirname(filePath), relativePath)
      callback(null, newFilePath)
    } else if (parsed['String Data'] !== undefined && parsed['String Data']['Icon location (UNICODE)'] !== undefined) {
        let tmp = pathAbs.absolute(parsed['String Data']['Icon location (UNICODE)'])
        let ext = path.extname(tmp)
        if (ext === '.ico') {
            callback(null, filePath, tmp)
        } else if (ext === '.dll') {
            callback(null, filePath)
        } else {
            callback(null, tmp)
        }
    } else if (parsed['Link Info'] !== undefined && parsed['Link Info']['Local path (ASCII)'] !== undefined) {
      if (parsed['Link Info']['Common path (ASCII)'] !== undefined) {
        filePath = path.resolve(parsed['Link Info']['Local path (ASCII)'] + parsed['Link Info']['Common path (ASCII)'])
        // console.log(filePath)
      } else {
        filePath = path.resolve(path.normalize(parsed['Link Info']['Local path (ASCII)']))
      }
      callback(null, filePath)
    } else if (parsed['Long filename'] !== undefined && parsed['String Data'] !== undefined && parsed['String Data']['Working Directory (UNICODE)'] !== undefined) {
      let tmp = pathAbs.absolute(path.join(parsed['String Data']['Working Directory (UNICODE)'], parsed['Long filename']))
      let ext = path.extname(tmp)
      if (ext === '.ico') {
        callback(null, filePath, tmp)
      } else {
        callback(null, tmp)
      }
    } else {
      callback(null, filePath)
      console.log('Did not find any icon for ' + filePath)
      // console.log('Did not find any icon for ' + filePath)
      /* console.log(parsed)
       console.log(error)
       console.log(stderr)
       callback('Icon Not Found')*/
    }
  })
}

exports.queryUrl = function (filePath, callback) {
  fs.readFile(filePath, 'utf8', function (err, data) {
    let parsed = parseURLString(data)
    if (err) {
      // console.log(err)
      callback(err, filePath)
    } else if (parsed['InternetShortcut'] !== undefined &&
      parsed['InternetShortcut']['IconFile'] !== undefined) {
      callback(null, parsed['InternetShortcut']['IconFile'])
    } else {
      callback(null, filePath)
      console.log('Did not found Icon: '+filePath)
      /* console.log(parsed)
       console.log(err)
       callback('Icon Not Found')*/
    }
  })
}

function parseLNKString (data) {
  var regex = {
    section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
    // param: /^\s*([\w\.\-\_]+)\s*:\s*(.*?)\s*$/,
    param: /^\s*(.*?):\s*\t*(.*?)$/,
    comment: /^\s*;.*$/
  }
  var value = {}
  var lines = data.split(/\r\n|\r|\n/)
  var section = null

  for (var x = 0; x < lines.length; x++) {
    if (regex.comment.test(lines[x])) {
      return
    } else if (regex.param.test(lines[x])) {
      var match = lines[x].match(regex.param)
      if (section) {
        value[section][match[1]] = match[2]
      } else {
        value[match[1]] = match[2]
      }
    } else if (regex.section.test(lines[x])) {
      match = lines[x].match(regex.section)
      value[match[1]] = {}
      section = match[1]
    } else if (lines[x].length === 0 && section) {
      section = null
    }
  }
  return value
}

function parseURLString (data) {
  var regex = {
    section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
    param: /^\s*([\w\.\-_]+)\s*=\s*(.*?)\s*$/,
    // param: /^\s*(.*?):\s*\t*(.*?)$/,
    comment: /^\s*;.*$/
  }
  var value = {}
  var lines = data.split(/\r\n|\r|\n/)
  var section = null

  for (var x = 0; x < lines.length; x++) {
    if (regex.comment.test(lines[x])) {
      return
    } else if (regex.param.test(lines[x])) {
      var match = lines[x].match(regex.param)
      if (section) {
        value[section][match[1]] = match[2]
      } else {
        value[match[1]] = match[2]
      }
    } else if (regex.section.test(lines[x])) {
      match = lines[x].match(regex.section)
      value[match[1]] = {}
      section = match[1]
    } else if (lines[x].length === 0 && section) {
      section = null
    }
  }
  return value
}
