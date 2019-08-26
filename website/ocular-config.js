const resolve = require('path').resolve;

const DOCS = require('../docs/table-of-contents.json');

const DEPENDENCIES = require('./package.json').dependencies;
// eslint-disable-next-line import/no-extraneous-dependencies
const ALIASES = require('ocular-dev-tools/config/ocular.config')({
  root: resolve(__dirname, '..')
}).aliases;

// When duplicating example dependencies in website, autogenerate
// aliases to ensure the website version is picked up
// NOTE: module dependencies are automatically injected
// TODO - should this be automatically done by ocular-gatsby?
const dependencyAliases = {};
for (const dependency in DEPENDENCIES) {
  dependencyAliases[dependency] = `${__dirname}/node_modules/${dependency}`;
}

module.exports = {
  logLevel: 3,

  PATH_PREFIX: '/probe.gl',

  DOC_FOLDER: '../docs/',
  ROOT_FOLDER: '..',
  DIR_NAME: __dirname,

  DOCS,

  PROJECT_TYPE: 'github',
  PROJECT_NAME: 'probe.gl',
  PROJECT_ORG: 'uber-web',
  PROJECT_URL: 'https://github.com/uber-web/probe.gl',
  PROJECT_DESC: 'JavaScript Console Logging, Instrumentation, Benchmarking and Test Utilities',

  FOOTER_LOGO: '',

  HOME_PATH: '/',
  HOME_HEADING: 'JavaScript Console Logging, Instrumentation, Benchmarking and Test Utilities',
  HOME_RIGHT: null,
  HOME_BULLETS: [
    {
      text: 'Console-Focused Logging',
      desc: `probe.gl optimizes for making console logs useful\
 rather than e.g. production logging to servers.`,
      img: 'images/icon-layers.svg'
    }, {
      text: 'Benchmarking and Regression Testing Support',
      desc: `Benchmarking API enables creation benchmarking suites, \
 and supports comparison of test across runs.`,
      img: 'images/icon-layers.svg'
    }, {
      text: 'Optimized Chrome Debugging Experience',
      desc: `Uses advanced console APIswhen available to create rich logs. \
 Provides fallbacks on other browsers, including Node.js.`,
      img: 'images/icon-layers.svg'
    },
    {
      text: 'Size Conscious',
      desc: 'An instrumentation library should be small.',
      img: 'images/icon-layers.svg'
    }
  ],

  PROJECTS: [
    /*
    'deck.gl': 'https://uber.github.io/deck.gl',
    'luma.gl': 'https://uber.github.io/luma.gl',
    'react-map-gl': 'https://uber.github.io/react-map-gl',
    'vis.gl': 'https://uber-web.github.io/vis.gl'
    */
  ], 
  
  EXAMPLES: [
    // TODO: This app is currently more a test app than an example + crashes when imported
    // {
    //  title: 'StatsWidget',
    //  // image: 'images/stats-widget.png',
    //  componentUrl: resolve(__dirname, '../examples/stats-widget/app.js'),
    //  path: 'examples/stats-widget'
    // }
  ],

  ADDITIONAL_LINKS: [],

  GA_TRACKING: null,


  // Ocular adds this to gatsby's webpack config
  webpack: {
    resolve: {
      alias: Object.assign({}, ALIASES, dependencyAliases)
    }
  }
};
