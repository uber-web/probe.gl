const {getBabelConfig, deepMerge} = require('ocular-dev-tools');

module.exports = api => {
  const defaultConfig = getBabelConfig(api, {react: true});

  const config = deepMerge(defaultConfig, {
    plugins: [],
    ignore: [
      // babel can't process .d.ts
      /\.d\.ts$/
    ]
  });

  // console.debug(config);
  return config;
};
