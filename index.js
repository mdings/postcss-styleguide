// libs and dependencies
var postcss = require('postcss');
var utils = require('./utils/utils');
var demo = require('./utils/demo');
var fm = require('front-matter');
var fs = require('fs');
var Q = require('q');
var appRoot = require('app-root-path');
var marked = require('marked');

/*
Defines the Styleguide class */
function Styleguide (options, sections, css) {
  var defaults = {
    output: 'styleguide',
    assets: {},
    css: css
  }
  this.options = utils.extend (defaults, options);
  this.sections = sections;
  this.init();
}

/*
Creates a new styleguide instance */
Styleguide.prototype.init = function () {
  this.createIndexFile();
  this.createSections();
}

/*
Creates the master index template in the output folder */
Styleguide.prototype.createIndexFile = function () {
  var template = [__dirname, 'assets/templates/index.pug'].join('/');
  var data = utils.render (template, {sections: this.sections, options: this.options});
  utils.write ([this.options.output, 'index.html'].join('/'), data)
}

/*
Creates the individual sections */
Styleguide.prototype.createSections = function () {
  var sections = this.sections;
  var options = this.options;

  // loop over each section
  Object.keys(sections).forEach (function(section) {
    var promises = [];

    // each section can have multiple demo blocks
    // we need to keep track of their async rendering status before
    // they can be written to file
    var demos = sections[section].map(function(attr){
      return attr.attributes.demo;
    });


    // push the demos in the promises array
    for (var i=0; i<demos.length; i++) {
      var body = marked (sections[section][i].body);
      var title = (sections[section][i].attributes.title);
      promises.push (demo(demos[i], title, body, options));
    }

    // resolve all demo's and only then write to file
    Q.all(promises)
      .then(function (values) {
        var data = {
          examples: values
        }

        // compile the sections
        var file = [section, 'html'].join('.');
        var template = [__dirname, 'assets/templates/section.pug'].join('/');
        var result = utils.render(template, data);

        // write the file
        utils.write ([options.dest, file].join('/'), result);
      });
  });
}

module.exports = postcss.plugin ('styleguide', function styleguide (options) {

  return function (css, result) {
    var sections = {};
    var input = css.source.input.file;
    options = options || {} ;

    if (options.src && (input.indexOf(options.src) > -1)) {
      // create the path to the styleguide
      utils.createPath (options.dest, function () {
        // write the css to the styleguide
        utils.write ([options.dest, options.src].join('/'), css.toString());
        // walk the css
        css.walkComments (function (comment) {
          // test if comment is valid front-matter
          if (fm.test (comment.text)) {
            var content = fm (comment.text);
            if (content.attributes.demo) {
              // create the object key if it doesn't exist yet
              var key = content.attributes.section.toDash();
              if (!sections[key]) sections[key] = [];
              sections[key].page = {
                name: content.attributes.section,
                url: key
              };
              sections[key].push(content);
            } else {
              result.warn ('Missing demo attribute');
            }
          }
        });
        new Styleguide (options, sections, css);
      }.bind(this));
    }
  }
})
