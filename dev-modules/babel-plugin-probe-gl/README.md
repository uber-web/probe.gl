# babel-plugin-probe-gl

Performs some useful transforms regarding the usage of probe.gl.

## Features

### Remove logs

Remove calls to specified logging methods. This is useful to reduce the logging system's footprint and performance impact in production environment.

The `Log` instance must be called `log` for this feature to work.

#### in

```js
import log from 'probe.gl';

canvas.addEventListener('click', evt => {
  log.log(1, `The user clicked the canvas: (${evt.pageX}, ${evt.pageY})`)();
  try {
    redraw();
  } catch (error) {
    log.error(error.message)();
  }
});
```

#### out

```js
import log from 'probe.gl';

canvas.addEventListener('click', () => {
  try {
    redraw();
  } catch (error) {
    log.error(error.message)();
  }
});
```


## Installation

```sh
$ npm install --save-dev babel-plugin-probe-gl
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": [["probe-gl", {
    "removeLogs": ["log", "warn"],
    "patterns": ["*.glsl.js"]
  }]]
}
```

### Via CLI

```sh
$ babel --plugins probe-gl script.js
```

### Via Node API

```js
require("babel-core").transform("code", {
  plugins: ["probe-gl"]
});
```

## Options

### patterns (Array)

An array of glob expressions that specify which files to apply this plugin to. Default `['**/*.js']`.

### removeLogs (Boolean|Array)

One of:

- `false` (default): Do not remove any logs
- `true`: Use the default setting, which will remove all log methods that prints to console except `log.error` and `log.removed`.
- Array<String>: A list of log methods to remove, for example `['log', 'warn']`
