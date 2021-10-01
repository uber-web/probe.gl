const {getWebpackConfig} = require('ocular-dev-tools');

const BABEL_CONFIG = {
  presets: ['@babel/env', '@babel/react']
};

module.exports = (env) => {
  const config = getWebpackConfig(env);

  // TODO - this is not being used by build process
  config.module.rules.push({
    test: /react-bench.*\.js$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'babel-loader',
        options: BABEL_CONFIG
      }
    ]
  });

  return config;
};
