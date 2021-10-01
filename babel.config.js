const {getBabelConfig} = require('ocular-dev-tools');

module.exports = (api) => {
  const config = getBabelConfig(api);

  // TODO - this only applies to one module...
  config.presets = (config.presets || []).concat(['@babel/preset-react']);
  config.plugins = (config.plugins || []).concat([]);

  return config;
};
