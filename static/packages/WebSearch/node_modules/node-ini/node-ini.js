var fs = require('fs');

var INI = function(){
  var self = this

  var obj = {}
    , regex = {
        section: {
          key: /^\s*\[\s*([^\]]*)\s*\]\s*$/
        , arr: /^\s*\[\s*([^\]]*)\s*\]\[\]\s*$/
        , obj: /^\s*\[\s*([^\]]*)\s*\]\[(\w+)\]\s*$/
        }
      , param: {
          key: /^\s*([\w\.\-\_]+)\s*=\s*(.*?)\s*$/
        , arr: /^\s*([\w\.\-\_]+)\[\]\s*=\s*(.*?)\s*$/
        , obj: /^\s*([\w\.\-\_]+)\[(\w+)\]\s*=\s*(.*?)\s*$/
        }
      , comment: [
          /^\s*;.*$/
        , /^\s*#.*$/
        , /^\s*\/\/.*$/
        ]
      };

  self.encoding = 'utf-8'
  self.curSection = {}

  var addParam = function(pType, cfg, match){
    switch(self.curSection.type){
      case "key":
        if(pType === 'key') cfg[self.curSection.name][match[1]] = match[2];
        else if(pType === 'arr') {
          if(typeof(cfg[self.curSection.name][match[1]]) === 'undefined'){
            cfg[self.curSection.name][match[1]] = [];
            self.curSection.pIndex = 0;
          }
          cfg[self.curSection.name][match[1]][self.curSection.pIndex] = match[2];
          self.curSection.pIndex++;
        }
        else if(pType === 'obj'){
          if(typeof(cfg[self.curSection.name][match[1]]) === 'undefined'){
            cfg[self.curSection.name][match[1]] = {};
          }
          cfg[self.curSection.name][match[1]][match[2]] = match[3];
        }
      break;
      case "arr":
        if(pType === 'key') {
          if(typeof(cfg[self.curSection.name][self.curSection.index]) === 'undefined'){
            cfg[self.curSection.name][self.curSection.index] = {}
          }
          cfg[self.curSection.name][self.curSection.index][match[1]] = match[2];
        }
        else if(pType === 'arr'){
          if(typeof(cfg[self.curSection.name][self.curSection.index][match[1]]) === 'undefined'){
            cfg[self.curSection.name][self.curSection.index][match[1]] = [];
            self.curSection.pIndex = 0;
          }
          cfg[self.curSection.name][self.curSection.index][match[1]][self.curSection.pIndex] = match[2]
          self.curSection.pIndex++;
        }
        else if(pType === 'obj'){
          if(typeof(cfg[self.curSection.name][self.curSection.index][match[1]]) === 'undefined'){
            cfg[self.curSection.name][self.curSection.index][match[1]] = {};
          }
          cfg[self.curSection.name][self.curSection.index][match[1]][match[2]] = match[3]
        }
      break;
      case "obj":
        if(pType === 'key') {
          if(typeof(cfg[self.curSection.name][self.curSection.key]) === 'undefined'){
            cfg[self.curSection.name][self.curSection.key] = {}
          }
          cfg[self.curSection.name][self.curSection.key][match[1]] = match[2];
        }
        else if(pType === 'arr'){
          if(typeof(cfg[self.curSection.name][self.curSection.key][match[1]]) === 'undefined'){
            cfg[self.curSection.name][self.curSection.key][match[1]] = [];
            self.curSection.pIndex = 0;
          }
          cfg[self.curSection.name][self.curSection.key][match[1]][self.curSection.pIndex] = match[2]
          self.curSection.pIndex++;
        }
        else if(pType === 'obj'){
          if(typeof(cfg[self.curSection.name][self.curSection.key][match[1]]) === 'undefined'){
            cfg[self.curSection.name][self.curSection.key][match[1]] = {};
          }
          cfg[self.curSection.name][self.curSection.key][match[1]][match[2]] = match[3]
        }
      break;
    }
    return;
  }

  var parse = function(data){
    var lines = data.split(/\r\n|\r|\n/)
      , cfg = {};

    lines.forEach(function(line){
      // Check for comments
      regex.comment.forEach(function(patt){
        if(patt.test(line)){
          return;
        }
      });

      // Check for a section
      Object.keys(regex.section).forEach(function(type){
        if(regex.section[type].test(line)){
          var match = line.match(regex.section[type]);
          self.curSection.type = type;
          self.curSection.name = match[1];
          switch(type){
            case "key":
              if(typeof(cfg[self.curSection.name]) === 'undefined'){
                cfg[self.curSection.name] = {};
              }
            break;
            case "arr":
              if(typeof(cfg[self.curSection.name]) === 'undefined'){
                cfg[self.curSection.name] = [];
                self.curSection.index = 0;
                cfg[self.curSection.name][0] = {};
              } else {
                self.curSection.index++;
              }
            break;
            case "obj":
              if(typeof(cfg[self.curSection.name]) === 'undefined') {
                cfg[self.curSection.name] = {};
                cfg[self.curSection.name][match[2]] = {};
              }
              self.curSection.key = match[2];
            break;
          }
        }
      });


      // Check for param
      Object.keys(regex.param).forEach(function(type){
        if(regex.param[type].test(line)){
          var match = line.match(regex.param[type]);
          switch(type){
            case "key":
              if(typeof(self.curSection.name) === 'undefined'){
                cfg[match[1]] = match[2];
              } else {
                addParam(type, cfg, match);
              }
            break;
            default:
              addParam(type, cfg, match)
            break;
          }
        }
      });
    });
    return cfg;
  }

  self.parse = function(file, fn){
    if(!fn){
      return self.parseSynce(file);
    }
    fs.readFile(file, self.encoding, function(err, data){
      if(err) fn(err);
      else fn(null, parse(data));
    });
  }

  self.parseSync = function(file){
    return parse(fs.readFileSync(file, self.encoding));
  }

}

module.exports = (function(){
  return new INI()
}())
