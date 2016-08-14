var yaml = require('js-yaml');
var loaderUtils = require('loader-utils');

function jsonValueReplacer(replacerConf, key, value){
  var blacklist = replacerConf.blacklist || [];
  var shouldRemoveKey = blacklist.indexOf(key) > -1;
  if (shouldRemoveKey) {
    console.info([
      'Removing key ', key,
      ' in file ', replacerConf.filename,
      '.'
    ].join('"'));
  }
  return shouldRemoveKey ? undefined : value;
}

module.exports = function ymlLoader(source, map){
  var loader = this;
  loader.cacheable && loader.cacheable();

  var query = loaderUtils.parseQuery(loader.query);
  var keysToRemove = query.keysToRemove;
  var filename = loader.resourcePath;

  var yamlFile = yaml.safeLoad(source, {
    filename: filename,
    onWarning: function emitLoaderWarning(error){
      loader.emitWarning(error.toString());
    }
  });

  var anyKeysToReplace = Array.isArray(keysToRemove) && keysToRemove.length;
  var replacerConf = {
    filename: filename,
    blacklist: keysToRemove
  };
  var replacerWithConf = anyKeysToReplace ? jsonValueReplacer.bind(replacerConf) : undefined;

  return [
    'module.exports = ',
    JSON.stringify(yamlFile, replacerWithConf, '\t'),
    ';'
  ].join('');
};