import {NodeGlobalsPolyfillPlugin} from '@esbuild-plugins/node-globals-polyfill';
import {NodeModulesPolyfillPlugin} from '@esbuild-plugins/node-modules-polyfill';

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
  }
};
