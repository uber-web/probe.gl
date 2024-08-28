const {getESLintConfig} = require('@vis.gl/dev-tools/configuration');

module.exports = getESLintConfig({
  react: '16.8.2',
  overrides: {
    env: {
      browser: true,
      es2020: true,
      node: true
    },

    rules: {
      'no-console': 'warn',
      'no-continue': ['warn'],
      'max-depth': ['warn', 4],
      camelcase: 'off',
      complexity: 'warn',
      'max-statements': 'warn'
    },

    overrides: [
      {
        files: ['**/*.ts', '**/*.tsx', '**/*.d.ts'],
        rules: {

          'no-shadow': 'off',
          '@typescript-eslint/no-shadow': 'error',
          'no-use-before-define': 'off',

          '@typescript-eslint/no-floating-promises': 0,
          // Gradually enable
          '@typescript-eslint/ban-ts-comment': 0,
          '@typescript-eslint/ban-types': 0,
          '@typescript-eslint/no-unsafe-member-access': 0,
          '@typescript-eslint/no-unsafe-assignment': 0,
          '@typescript-eslint/no-var-requires': 0,
          '@typescript-eslint/no-empty-function': ['warn', {allow: ['arrowFunctions']}],
          // We always want explicit typing, e.g `field: string = ''`
          '@typescript-eslint/no-inferrable-types': 0,
          '@typescript-eslint/restrict-template-expressions': 0,
          '@typescript-eslint/explicit-module-boundary-types': 0,
          '@typescript-eslint/require-await': 0,
          '@typescript-eslint/no-explicit-any': 0,
          '@typescript-eslint/no-unsafe-argument': 0,
          '@typescript-eslint/no-unsafe-return': 0,
          '@typescript-eslint/no-unsafe-call': 0,
          '@typescript-eslint/no-empty-interface': 0,
          '@typescript-eslint/restrict-plus-operands': 0
        }
      },
      // tests are run with aliases set up in node and webpack.
      // This means lint will not find the imported files and generate false warnings
      {
        // scripts use devDependencies
        files: ['**/test/**/*.js', '**/test/**/*.ts', '**/scripts/**/*.js', '*.config.js', '*.config.local.js'],
        rules: {
          'import/no-unresolved': 0,
          'import/no-extraneous-dependencies': 0
        }
      },
      {
        files: ['examples/**/*.js'],
        rules: {
          'import/no-unresolved': 0
        }
      }
    ],

    settings: {
      // Ensure eslint finds typescript files
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx']
        }
      }
    }
  }
});
