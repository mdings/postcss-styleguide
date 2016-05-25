var fs = require('fs');
var pug = require('pug');
var mkpath = require('mkpath');
var Q = require('q');

// promised node functions
var nkpath = Q.denodeify(mkpath);

String.prototype.toDash = function (){
  return this.trim().split(' ').join('-').toLowerCase();
};

String.prototype.toHtmlEntities = function () {
  return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

var copy = function (from, to) {
  fs.createReadStream(from).pipe(fs.createWriteStream(to));
}

var write = function (to, data) {
  fs.writeFile (to, data, {encoding: 'utf-8', flag: 'w+'}, function (err) {
    if (err) console.log (err);
  })
}

var extend = function extend (obj, src) {
  Object.keys(src).forEach (function (key) {
    obj[key] = src[key];
  });
  return obj;
}

var render = function (file, data) {
  var fn = pug.compileFile (file, {pretty: true, compileDebug: true});
  return fn (data);
}

var createPath = function (path, cb) {
  if (fsExistsSync(path)) {
    cb();
  } else {
    nkpath (path)
      .then (function() {
        cb();
      }.bind(this));
  }
}

var fsExistsSync = function (myDir) {
  try {
    fs.accessSync(myDir);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = {
  copy: copy,
  write: write,
  extend: extend,
  render: render,
  createPath: createPath,
  fsExistsSync: fsExistsSync
}
