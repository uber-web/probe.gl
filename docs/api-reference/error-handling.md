# Error Handling

## Functions

### breakOnConsoleWarnings

Ensure that your debugger stops when code issues warnings so that
you can see what is going on in othercomponents when they decide
to issue warnings.
 * {Array} consoleBlacklist - array of strings to match against

### throwOnConsoleWarnings

Throw exceptions when code issues warnings so that
you can access them in your normal exception handling setup, perhaps
displaying them in the UI or logging them in a different way.

* {Array} consoleBlacklist - array of strings to match against

### interceptRejectedPromises

Chrome has yet to implement onRejectedPromise, so trigger onerror instead
