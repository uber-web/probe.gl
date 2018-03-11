# About Benchmarking

probe.gl offers a `Bench` facility that makes it easy to create "micro-benchmarks" for optimization and regression testing purposes.

## Goals

* Fast benchmarking - Assumes benchmarks are run frequently and need to run fast. Sacrifice some precision for fast results (configurable)
* Reporting - Want to copy your benchmarks into reports? You can provide custom formatters, or use exiting formatters like the markdown formatter.
* Priority - As with everything in probe.gl, you can assign a priority to each bench case, e.g. enabling a quick run of top level test cases, or a drill down run that benches multiple variations.
* Regression - Automatically stores values from previous runs and compares the current run against them.
* Browser and Node - As always, probe.gl makes sure that your benchmarks will run under Node.js as well as in the browser (be aware that performance can differ quite a bit between the two).


## What is a "Micro Benchmark"

A micro benchmark is simply a function you supply, that will be run for a number of times with a timer to determine how many times per second it can be executed.


## Structure of a Benchmark Suite

Instantiate the `Bench` class to create a benchmark suite. use `bench.group` to group bench cases and add headers. Use `bench.add` to register individual benchmarks.

