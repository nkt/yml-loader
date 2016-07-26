YAML Loader
===========

YAML loader for [webpack](https://webpack.github.io).


Installation
------------

```
npm instal --save-dev yml-loader
```

Usage
-----

```js
// webpack.config.js

module.exports = {
  module: {
    loaders: [
      {
        test: /\.yml$/,
        loader: 'yml'
      }
    ]
  }
};
```

License
-------
[MIT](LICENSE)
