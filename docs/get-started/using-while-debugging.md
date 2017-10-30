# Using Probe while Debugging

Probe makes a global variable `window.Probe` available in the browser console. This variable holds an object with methods that you can call directly in the allows you to interact with `Probe` to enable and disable flags (or Probe itself), you can change the log priority etc.

```
> window.Probe
...
> window.Probe.enable()
> window.Probe.setLogPriority()
```

## Probe Commands

### Enabling and Disabling

### Changing Log Priority
