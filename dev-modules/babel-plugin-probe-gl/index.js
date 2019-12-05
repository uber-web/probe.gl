const minimatch = require('minimatch');

const DEFAULT_REMOVE_LOGS = [
  'log',
  'probe',
  'deprecated',
  'info',
  'once',
  'group',
  'groupCollapsed',
  'groupEnd',
  'table',
  'image',
  'timeStamp',
  'time',
  'timeEnd'
];
const DEFAULT_PATTERNS = ['**/*.js'];

module.exports = function _(opts) {
  return {
    visitor: {
      MemberExpression(path, state) {
        if (!filterFile(state)) {
          return;
        }
        const logMethods = getLogMethods(state);

        if (logMethods && path.get('object').isIdentifier({name: 'log'})) {
          const property = path.get('property');
          const methodName = logMethods.find(name => property.isIdentifier({name}));
          if (methodName) {
            // Uncomment to debug
            // console.log(`${state.file.opts.filename}: log.${methodName} removed`);
            path.parentPath.parentPath.remove();
          }
        }
      }
    }
  };
};

function getLogMethods(state) {
  const logMethods = state.opts.removeLogs;
  if (logMethods === true) {
    return DEFAULT_REMOVE_LOGS;
  }
  if (Array.isArray(logMethods) && logMethods.length) {
    return logMethods;
  }
  return null;
}

function filterFile(state) {
  const {filename} = state;
  const patterns = state.opts.patterns || DEFAULT_PATTERNS;

  return patterns.some(p => {
    return minimatch(filename, p);
  });
}
