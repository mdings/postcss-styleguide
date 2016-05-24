var fs = require('fs');
var Q = require('q');
var utils = require('./utils');
var appRoot = require('app-root-path');

// template parsers
var twig = require('node-twig').renderFile;
var pug = require('pug');

var demo = function (demo, title, body, options) {
  var deferred = Q.defer();
  var split = demo.split(" ").filter(Boolean);
  var file = split[0];
  var data = split[1];
  var ext = file.split('.').pop();

  var template = fs.readFileSync(file, 'utf-8').toString();
  var json = (data) ? JSON.parse(fs.readFileSync(data, 'utf-8').toString()) : {};

  switch (ext) {

    // pug and jade rendering
    case 'jade':
    case 'pug':
      var fn = pug.compile (template, {pretty: true, compileDebug: false});
      deferred.resolve({
        result: fn(json),
        title: title,
        body: body,
        template: template.toHtmlEntities(),
        lang: 'language-jade'
      });
      break;

    // twig rendering
    case 'twig':
      var config = {
        root: appRoot.path,
        context: json,
      };

      // add extensions if provided in options object
      if (options.twig.extensions) {
        config.extensions = [{
          file: [appRoot.path, options.twig.extensions].join('/'),
          func: 'myTwigExtension'
        }]
      };

      twig (file, config, function (error, result) {
        if (error) console.log (error);
        deferred.resolve({
          result: result,
          title: title,
          body: body,
          template: template.toHtmlEntities(),
          lang: 'language-twig'
        });
      });
      break;

      case 'php':
        var config = {
          root: appRoot.path,
          context: json,
        };

        // php is rendered through adapted twig hanlder
        twig (file, config, function (error, result) {
          if (error) console.log (error);
          deferred.resolve({
            result: result,
            title: title,
            body: body,
            template: template.toHtmlEntities(),
            lang: 'language-php'
          });
        });
        break;

    // no template rendering
    default:
      deferred.resolve({
        result: template,
        title: title,
        body: body,
        template: template.toHtmlEntities(),
        lang: 'language-markup'
      });
  }

  return deferred.promise;
}

module.exports = demo;
