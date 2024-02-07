import {BrowserTestDriver} from '@probe.gl/test-utils';

const mode = process.argv[2];

new BrowserTestDriver().run({
  title: 'Unit Tests',
  server: {
    port: 'auto',
    command: 'webpack-dev-server',
    arguments: ['--config', 'webpack.config.cjs'],
    wait: 3000
  },
  headless: mode === 'headless'
});
