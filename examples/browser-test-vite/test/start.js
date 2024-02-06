import {BrowserTestDriver} from '@probe.gl/test-utils';
import {createServer} from 'vite';

const mode = process.argv[2];

async function startViteServer(opts) {
  const server = await createServer({
    configFile: './vite.config.js',
    mode: 'development',
    server: {
      port: opts.port
    }
  });
  await server.listen();

  return {
    url: server.resolvedUrls.local[0],
    stop: () => {
      server.close();
    }
  };
}

new BrowserTestDriver().run({
  title: 'Unit Tests',
  server: {
    port: 'auto',
    start: startViteServer
  },
  headless: mode === 'headless'
});
