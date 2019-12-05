const {resolve} = require('path');

const config = {
  lint: {
    paths: ['modules', 'examples', 'test'],
    extensions: ['js']
  },

  aliases: {
    // DEV MODULES
    'dev-modules': resolve(__dirname, './dev-modules')
  },

  entry: {
    test: 'test/node.js',
    'test-browser': 'test/browser.js',
    bench: 'test/bench/index.js',
    'bench-browser': 'test/bench/browser.js',
    size: {
      log: 'test/size/log.js',
      stat: 'test/size/stat.js'
    }
  }
};

module.exports = config;
