const {resolve} = require('path');

const config = {
  lint: {
    paths: ['modules', 'examples', 'test'],
    extensions: ['js']
  }
};

module.exports = config;
