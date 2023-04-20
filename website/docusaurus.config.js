// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const webpack = require('webpack');
const {resolve} = require('path');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'probe.gl',
  tagline: 'JavaScript Console Logging, Instrumentation, Benchmarking and Test Utilities',
  url: 'https://visgl.github.io',
  baseUrl: '/probe.gl',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: '/favicon.png',
  organizationName: 'visgl', // Usually your GitHub org/user name.
  projectName: 'probe.gl', // Usually your repo name.
  trailingSlash: false,

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: '../docs',
          sidebarPath: resolve('./src/docs-sidebar.js'),
          // Point to to the website directory in your repo.
          editUrl: 'https://github.com/visgl/probe.gl/tree/master/website',
        },
        theme: {
          customCss: [
            resolve('./src/styles.css'),
            // resolve('./node_modules/maplibre-gl/dist/maplibre-gl.css')
          ],
        },
      }),
    ]
  ],

  plugins: [
    [
      './ocular-docusaurus-plugin',
      {
        debug: true,
        resolve: {
          modules: [resolve('node_modules'), resolve('../node_modules')],
          alias: {
            'website-examples': resolve('../examples'),

            '@probe.gl/bench': resolve('../modules/bench'),
            '@probe.gl/env': resolve('../modules/env'),
            '@probe.gl/log': resolve('../modules/log'),
            '@probe.gl/react-bench': resolve('../modules/bench'),
            '@probe.gl/seer': resolve('../modules/seer'),
            '@probe.gl/stats': resolve('../modules/stats'),
            '@probe.gl/stats-widget': resolve('../modules/widget'),
            '@probe.gl/test-utils': resolve('../modules/utils')
          }
        },
        plugins: [
          // new webpack.EnvironmentPlugin(['MapboxAccessToken', 'GoogleMapsAPIKey', 'GoogleMapsMapId']),
        ],
        module: {
          rules: [
          ]
        }
      }
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'examples',
        path: './src/examples',
        routeBasePath: 'examples',
        sidebarPath: resolve('./src/examples-sidebar.js'),
        breadcrumbs: false,
        docItemComponent: resolve('./src/components/example/doc-item-component.jsx')
      },
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'probe.gl',
        logo: {
          alt: 'vis.gl Logo',
          src: 'images/visgl-logo-dark.png',
        },
        items: [
          {
            to: '/docs',
            position: 'left',
            label: 'Docs',
          },
          // {
          //   to: '/examples',
          //   position: 'left',
          //   label: 'Examples',
          // },
          // {
          //   to: '/showcase',
          //   position: 'left',
          //   label: 'Showcase',
          // },
          {
            to: 'https://medium.com/vis-gl',
            label: 'Blog',
            position: 'left'
          },
          {
            href: 'https://github.com/visgl/probe.gl',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Other vis.gl Libraries',
            items: [
              {
                label: 'luma.gl',
                href: 'https://luma.gl',
              },
              {
                label: 'loaders.gl',
                href: 'https://loaders.gl',
              },
              {
                label: 'deck.gl',
                href: 'https:/deck.gl',
              },
              {
                label: 'vis.gl',
                href: 'https://vis.gl',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'deck.gl slack',
                href: 'https://join.slack.com/t/deckgl/shared_invite/zt-7oeoqie8-NQqzSp5SLTFMDeNSPxi7eg',
              },
              {
                label: 'vis.gl blog on Medium',
                href: 'https://medium.com/vis-gl',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/visgl/probe.gl',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} OpenJS Foundation`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
