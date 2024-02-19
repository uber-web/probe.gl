import {NodeGlobalsPolyfillPlugin} from '@esbuild-plugins/node-globals-polyfill';
import {NodeModulesPolyfillPlugin} from '@esbuild-plugins/node-modules-polyfill';
import istanbul from 'vite-plugin-istanbul';

export default {
  optimizeDeps: {
    // Polyfill for Node environment (required by tape-promise)
    esbuildOptions: {
      define: {
        global: 'globalThis',
        __dirname: '"."'
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true
        }),
        NodeModulesPolyfillPlugin()
      ]
    }
  },
  plugins: [
    istanbul({
      include: 'test/*',
      exclude: ['node_modules'],
      extension: ['.js', '.ts', '.cjs', '.mjs', '.jsx', '.tsx'],
      // require the env var VITE_COVERAGE to equal true in order to instrument the code
      requireEnv: true
    })
  ]
};
