# Problems with Console Logging

Whether to use a library like probe.gl to improve on built-in console logging tends to be a personal preference, and people tend to have strong opinions on the matter. Certainly, at first blush, a console-wrapping library seems like a fairly low value proposition. The browser already provides a logging facility, why spend effort and code size wrapping it?

To illustrate some of the problems probe.gl is attempting to solve, let's consider how one would write a simple logging wrapper for an app that had started logging using the raw API.

```js
function app() {
  console.debug('hello world')
}
```

Let's saywe want a function that logs conditionally (only if a `priority` has been set), and only issues a warning once to avoid flooding the console. A first attempt could look like this

```js
function log(priority, message) {
  if (priority <= logPriority)
  	if (!cache[message]) {
  	  console.debug(message);
  	}
  }
}
...
app() {
  log(1, 'hello world');
}
```

Some issues with this:
* Now the log message in Chrome console no longer let's you click back to the application. Instead it links back to the log function.

In addition:
* console.debug is not available in Node.js and certain browsers.
