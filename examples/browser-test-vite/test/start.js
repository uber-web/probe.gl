import {BrowserTestDriver} from '@probe.gl/test-utils';
import {createServer} from 'vite';
import fs from 'fs/promises';

const mode = process.argv[2];
const CoverageOutputDir = './.nyc_output';

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
  headless: mode === 'headless',
  onFinish: async ({page, isSuccessful}) => {
    if (!isSuccessful) return;
    const coverage = await page.evaluate('window.__coverage__');
    if (coverage) {
      await fs.rm(CoverageOutputDir, {force: true, recursive: true});
      await fs.mkdir(CoverageOutputDir);
      await fs.writeFile(`${CoverageOutputDir}/out.json`, JSON.stringify(coverage), 'utf8');
    }
  }
});
