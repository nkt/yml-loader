var yaml = require('js-yaml');

module.exports = function (source) {
  var loader = this;

  loader.cacheable && loader.cacheable();
  var value = yaml.safeLoad(source, {
    filename: loader.resourcePath,
    onWarning: function (error) {
      loader.emitWarning(error.toString());
    }
  });

  return 'module.exports = ' + JSON.stringify(value, null, '\t') + ';';
};
