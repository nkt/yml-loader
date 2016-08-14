var yaml = require('js-yaml');
var parseQuery = require('loader-utils').parseQuery;


function jsonValueReplacer(replacerConf, key, value){
  var blacklist = replacerConf.blacklist || [];
  var shouldRemoveKey = blacklist.indexOf(key) > -1;
  if (shouldRemoveKey) {
    if (replacerConf.debug) {
      replacerConf.loader.emitWarning([
        'Removing key ', key,
        ' from file ', replacerConf.filename,
        '.'
      ].join('"'));
    }
    return undefined;
  }
  return value;
}

module.exports = function ymlLoader(source, map){
  var loader = this;
  loader.cacheable && loader.cacheable();

  var filename = loader.resourcePath;

  var yamlFile = yaml.safeLoad(source, {
    filename: filename,
    onWarning: function emitLoaderWarning(error){
      loader.emitWarning(error.toString());
    }
  });
  var query = parseQuery(loader.query);
  var debug = 'debug' in query ? query.debug : loader.debug || false;
  var keysToRemove = query.keysToRemove || [];
  var anyKeysToRemove = Boolean(Array.isArray(keysToRemove) && keysToRemove.length);
  var replacerConf = {
    debug: debug,
    loader: loader,
    filename: filename,
    blacklist: keysToRemove
  };
  var replacerWithConf = anyKeysToRemove ? jsonValueReplacer.bind(null, replacerConf) : undefined;

  var result;
  try {
    result = JSON.stringify(yamlFile, replacerWithConf, '\t');
  } catch (ex) {
    result = JSON.stringify({
      exception: ex,
      error: ex.message,
      filename: filename,
      keysToRemove: keysToRemove
    });
    loader.emitError([
      'Failed to stringify yaml from file ', filename, '! Message: ',
      ex.message, ' Stack: \n', ex.stack
    ].join('"'));
  }
  return 'module.exports = ' + result + ';';
};