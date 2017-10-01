# probe.gl

A debug library - Created to instrumenting applications to get timings in browser console or in node. The name Probe relates to the concept of instrumenting your application by injecting probes (intelligent information collection checkpoints) into its source code. The probes then collect data about your application when you run it.

In addition to instrumentation Probe also supports a number of other debug related facilities, such as console log interception, global context in debugger etc.


## Features

* **Configuration Support** - Probe persists its configuration via cookies and and makes any flags and values available to your app. You can add a new feature check to your code without having to do any additional plumbing.
* **Multiple high-resolution timers** - Your "probes" log both time since operation start and delta time since last probe. Timing metrics received e.g. from a server can be presented as part of client side timings.
    * **Samples** - measuring repeated calls, average times, log throttling.
    * **FPS** - Can trace FPS.
    * **Tabulation** - Can generate tables of samples.
    * **JSON log format** - Simplifies copy/paste of log probe output into other apps.
    * **High Resolution Timer** - traces at submillisecond level.
* **Off by Default** Probe also reads some predefined keys from the URL hash that control whether probe is active or not. So you have the option of leaving probe in production code. Built-in options include enabling probe, setting log level, help etc.
* **Supports Node and Browser** - Uses platform specific versions of facilities like high resolution timers.


## History

probe.gl was open sourced to serve as the common instrumentation and logging library for frameworks in the Uber Visualization Suite. The suffix '.gl' is added to hint that this library is associated with this suite, rather than to signal any dependency on e.g. WebGL.
