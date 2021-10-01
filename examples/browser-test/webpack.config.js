// bundles tests to run in a browser
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  mode: 'development',

  entry: {
    app: './test/index.js'
  },

  node: {
    fs: 'empty'
  },

  plugins: [new HtmlWebpackPlugin({title: 'Browser test example'})]
};

// Enables bundling against src in this repo rather than the installed version
module.exports = (env) =>
  env && env.local ? require('../webpack.config.local')(config)(env) : config;
