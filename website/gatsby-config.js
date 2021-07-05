const resolve = require('path').resolve;
const DOCS = require('../docs/table-of-contents.json');

module.exports = {
  plugins: [
    {
      resolve: `gatsby-theme-ocular`, 
      options: {
        logLevel: 1,
      
        DOC_FOLDER: '../docs/',
        ROOT_FOLDER: '..',
        DIR_NAME: __dirname,
      
        DOCS,
      
        PATH_PREFIX: '/probe.gl',
      
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
      
        EXAMPLES: [
          // TODO: This app is currently more a test app than an example + crashes when imported
          {
           title: 'StatsWidget',
           image: 'images/stats-widget.png',
           componentUrl: resolve(__dirname, '../examples/stats-widget/app.js'),
           path: 'examples/stats-widget'
          }
        ],
      
        PROJECTS: [
          {
            name: 'vis.gl',
            url: 'https://vis.gl'
          },
          {
            name: 'deck.gl',
            url: 'https://deck.gl'
          },
          {
            name: 'luma.gl',
            url: 'https://luma.gl'
          },
          {
            name: 'nebula.gl',
            url: 'https://nebula.gl'
          }
        ],

        LINK_TO_GET_STARTED: '/docs/developer-guide/get-started',

        ADDITIONAL_LINKS: [{
          name: 'Blog',
          href: 'http://medium.com/vis-gl',
          index: 1
        }],

        STYLESHEETS: [''],
      
        GA_TRACKING: null,
      }        
    },
    {resolve: 'gatsby-plugin-no-sourcemaps'}
  ],
};
