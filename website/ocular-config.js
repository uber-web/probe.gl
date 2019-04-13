const DOCS = require('../docs/table-of-contents.json');

module.exports = {
  logLevel: 3,

  DOC_FOLDER: '../docs/',
  ROOT_FOLDER: '..',
  DIR_NAME: __dirname,

  EXAMPLES: [],
  DOCS,

  PROJECTS: [
    /*
    'deck.gl': 'https://uber.github.io/deck.gl',
    'luma.gl': 'https://uber.github.io/luma.gl',
    'react-map-gl': 'https://uber.github.io/react-map-gl',
    'vis.gl': 'https://uber-web.github.io/vis.gl'
    */
  ], // Other linked projects

  PROJECT_TYPE: 'github',
  PROJECT_NAME: 'probe.gl',
  PROJECT_ORG: 'uber-web',
  PROJECT_URL: 'https://github.com/uber-web/probe.gl',
  PROJECT_DESC: 'JavaScript Console Logging, Instrumentation, Benchmarking and Test Utilities',
  WEBSITE_PATH: '/website/',

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

  ADDITIONAL_LINKS: [],

  GA_TRACKING: null,

  // For showing star counts and contributors.
  // Should be like btoa('YourUsername:YourKey') and should be readonly.
  GITHUB_KEY: null,

  // TODO - from gatsby starter, remove once ocular is updated
  siteUrl: "https://probe.gl", // Domain of your website without pathPrefix.
  pathPrefix: "/probe.gl/", // Prefixes all links. For cases when deployed to example.github.io/gatsby-advanced-starter/.
  siteRss: "/rss.xml" // Path to the RSS file.
};
