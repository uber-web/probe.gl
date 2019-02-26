// Enables ES2015 import/export in Node.js
const path = require('path');

const ALIASES = {
  // Main lib
  'probe.gl': path.resolve(__dirname, './modules/core/src'),
  '@probe.gl/bench': path.resolve(__dirname, './modules/bench/src'),
  '@probe.gl/test-utils': path.resolve(__dirname, './modules/test-utils/src'),
  '@probe.gl/stats-widget': path.resolve(__dirname, './modules/stats-widget/src')
};

module.exports = ALIASES;
