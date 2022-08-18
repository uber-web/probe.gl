const {BrowserTestDriver} = require('@probe.gl/test-utils');

const mode = process.argv[2];

new BrowserTestDriver().run({
  title: 'Unit Tests',
  server: {
    command: 'vite',
    arguments: []
  },
  headless: mode === 'headless'
});
