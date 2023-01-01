const {getBabelConfig} = require('ocular-dev-tools/configuration');

module.exports = getBabelConfig({
  react: true,
  overrides: {
    plugins: [],
    ignore: [
      // babel can't process .d.ts
      /\.d\.ts$/
    ]
  }
});
