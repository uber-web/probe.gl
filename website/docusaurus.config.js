const {getDocusaurusConfig} = require('@vis.gl/docusaurus-website');

const config = getDocusaurusConfig({
  projectName: 'probe.js',
  tagline: 'JavaScript Console Logging, Instrumentation, Benchmarking and Test Utilities',
  siteUrl: 'https://visgl.github.io/probe.gl',
  repoUrl: 'https://github.com/visgl/probe.gl',

  docsTableOfContents: require('../docs/table-of-contents.json'),

  // examplesDir: './src/examples',
  // exampleTableOfContents: require('./src/examples/table-of-contents.json'),

  search: 'local'
});

module.exports = config;
