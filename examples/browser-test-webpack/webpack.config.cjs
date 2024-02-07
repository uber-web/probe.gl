
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',

  entry: {
    app: './test/index.js'
  },

  resolve: {
    fallback: {
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify')
    }
  },

  plugins: [
    new HtmlWebpackPlugin({title: 'Browser test example'}),
    new webpack.ProvidePlugin({
      process: 'process/browser'
    })
  ]
}
