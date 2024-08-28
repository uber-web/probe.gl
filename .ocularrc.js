/* @type import('ocular-dev-tools').OcularConfig */
export default {
  lint: {
    paths: ['modules', 'examples', 'test']
  },

  entry: {
    test: 'test/node.js',
    'test-browser': 'test/index.html',
    bench: 'test/bench/index.ts',
    'bench-browser': 'test/bench/browser.ts',
    size: ['test/size/log.js', 'test/size/stat.js']
  }
};
