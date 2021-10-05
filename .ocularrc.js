const config = {
  lint: {
    paths: ['modules', 'examples', 'test']
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
