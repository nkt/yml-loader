var yaml = require('js-yaml');
var loaderUtils = require('loader-utils');

function jsonValueReplacer(blacklist, key, value){
  return blacklist.indexOf(key) > -1 ? undefined : value;
}

module.exports = function ymlLoader(source, map){
  var loader = this;
  loader.cacheable && loader.cacheable();

  var query = loaderUtils.parseQuery(loader.query);
  var keysToRemove = query.keysToRemove;

  var value = yaml.safeLoad(source, {
    filename: loader.resourcePath,
    onWarning: function emitLoaderWarning(error){
      loader.emitWarning(error.toString());
    }
  });

  var anyKeysToReplace = Array.isArray(keysToRemove) && keysToRemove.length;
  var replacer = anyKeysToReplace ? jsonValueReplacer.bind(keysToRemove) : undefined;

  return [
    'module.exports = ',
    JSON.stringify(value, replacer , '\t'),
    ';'
  ].join('');
};