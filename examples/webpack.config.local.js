// This file contains webpack configuration settings that allow
// examples to be built against the source code in this repo instead
// of building against their installed version.
//
// This enables using the examples to debug the main library source
// without publishing or npm linking, with conveniences such hot reloading etc.

/* eslint-disable import/no-extraneous-dependencies */
const resolve = require('path').resolve;
const ALIASES = require('ocular-dev-tools/config/ocular.config')({
  root: resolve(__dirname, '..')
}).aliases;

// Support for hot reloading changes to the library:
const LOCAL_DEVELOPMENT_CONFIG = {
  mode: 'development',

  devtool: 'source-map',

  // this is required by draco
  node: {
    fs: 'empty'
  },

  resolve: {
    // Imports the library from its src directory in this repo
    alias: ALIASES
  },

  module: {
    rules: [
      {
        // Unfortunately, webpack doesn't import library sourcemaps on its own...
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre'
      }
    ]
  }
};

function addLocalDevSettings(config, opts) {
  config = Object.assign({}, LOCAL_DEVELOPMENT_CONFIG, config);
  config.resolve = config.resolve || {};
  config.resolve.alias = config.resolve.alias || {};
  Object.assign(config.resolve.alias, LOCAL_DEVELOPMENT_CONFIG.resolve.alias);

  config.module = config.module || {};
  config.module.rules = config.module.rules || [];
  config.module.rules = config.module.rules.concat(LOCAL_DEVELOPMENT_CONFIG.module.rules);

  return config;
}

module.exports = (baseConfig, opts = {}) => env => {
  let config = baseConfig;

  if (env && env.local) {
    config = addLocalDevSettings(config, opts);
  }

  // uncomment to debug
  // console.warn(JSON.stringify(config, null, 2));
  return config;
};
