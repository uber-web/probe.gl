const {BrowserTestDriver} = require('@probe.gl/test-utils');

/* global process */
const mode = process.argv[2];

new BrowserTestDriver().run({
  title: 'Unit Tests',
  server: {
    command: 'webpack-dev-server',
    arguments: ['--config', 'webpack.config.js']
  },
  headless: mode === 'headless'
});
