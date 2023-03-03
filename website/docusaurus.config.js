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
  url: 'https://probe.gl',
  baseUrl: '/probe.gl',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: '/favicon.png',
  organizationName: 'uber-web', // Usually your GitHub org/user name.
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
          editUrl: 'https://github.com/uber-web/probe.gl/tree/master/website',
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

            '@probe.gl/types': resolve('../modules/types/src'),
            '@probe.gl/core': resolve('../modules/core/src'),
            '@probe.gl/culling': resolve('../modules/culling/src'),
            '@probe.gl/geospatial': resolve('../modules/geospatial/src'),
            '@probe.gl/geoid': resolve('../modules/geoid/src'),
            '@probe.gl/polygon': resolve('../modules/polygon/src'),
            '@probe.gl/proj4': resolve('../modules/proj4/src'),
            '@probe.gl/web-mercator': resolve('../modules/web-mercator/src'),
            '@probe.gl/sun': resolve('../modules/sun/src'),
            '@probe.gl/geohash': resolve('../modules/mapbox/geohash'),
            '@probe.gl/quadkey': resolve('../modules/quadkey/src'),
            '@probe.gl/s2': resolve('../modules/s2/src'),

            '@probe.gl/bench': resolve('../node_modules/@probe.gl/bench')
          }
        },
        plugins: [
          // new webpack.EnvironmentPlugin(['MapboxAccessToken', 'GoogleMapsAPIKey', 'GoogleMapsMapId']),
          // These modules break server side bundling
          new webpack.IgnorePlugin({
            resourceRegExp: /asciify-image/
          })
        ],
        module: {
          rules: [
            // https://github.com/Esri/calcite-components/issues/2865
            {
              test: /\.m?js/,
              resolve: {
                fullySpecified: false
              }
            }
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
            to: '/examples',
            position: 'left',
            label: 'Examples',
          },
          {
            to: '/docs',
            position: 'left',
            label: 'Docs',
          },
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
            href: 'https://github.com/uber-web/probe.gl',
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
                href: 'https://github.com/uber-web/probe.gl',
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
