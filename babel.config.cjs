const {getBabelConfig} = require('ocular-dev-tools/configuration');

module.exports = getBabelConfig({
  react: true,
  overrides: {
    plugins: [],
    ignore: [
      // babel can't process .d.ts
      /\.d\.ts$/
    ],
    // These settings reduce the verbosity of transpile outputs
    assumptions: {
      // When declaring classes, assume that methods don't shadow getters on the superclass and that the program doesn't depend on methods being non-enumerable.
      setClassMethods: true,
      // When using public class fields, assume that they don't shadow any getter in the current class, in its subclasses or in its superclass.
      setPublicClassFields: true
    }
  }
});
