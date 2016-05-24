var fs = require('fs');
var pug = require('pug');

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
  fsExistsSync: fsExistsSync
}
