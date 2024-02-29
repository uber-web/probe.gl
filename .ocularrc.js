/* @type import('ocular-dev-tools').OcularConfig */
export default {
  babel: false,

  typescript: {
    project: 'tsconfig.build.json'
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
