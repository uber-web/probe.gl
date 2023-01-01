export default {
  typescript: {
    project: 'tsconfig.modules.json'
  },

  lint: {
    paths: ['modules', 'examples', 'test']
  },

  entry: {
    test: 'test/node.js',
    'test-browser': 'test/browser.js',
    bench: 'test/bench/index.ts',
    'bench-browser': 'test/bench/browser.ts',
    size: ['test/size/log.js', 'test/size/stat.js']
  }
};
