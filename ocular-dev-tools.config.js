const config = {
  lint: {
    paths: ['modules', 'examples', 'test'],
    extensions: ['js']
  },

  entry: {
    test: 'test/modules/index.js',
    'test-browser': 'test/browser.js',
    bench: 'test/bench/index.js',
    'bench-browser': 'test/bench/browser.js',
    size: 'test/size/import-nothing.js'
  }
};

module.exports = config;
