import fs from 'fs/promises';
import {defineConfig} from 'vite';

/** @see https://vitejs.dev/config/ */
export default defineConfig(async () => ({
  resolve: {alias: await getAliases('@probe.gl', `${__dirname}/../..`)},
  server: {open: true},
  // tape/vite integration issue https://github.com/vitejs/vite/issues/1973
  define: {
    'process.env': process.env
  }
}));

/** Run against local source */
const getAliases = async (frameworkName, frameworkRootDir) => {
  const modules = await fs.readdir(`${frameworkRootDir}/modules`);
  const aliases = {};
  for (const module of modules) {
    aliases[`${frameworkName}/${module}`] = `${frameworkRootDir}/modules/${module}/src`;
  }
  return aliases;
};
