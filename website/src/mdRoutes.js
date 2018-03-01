// Copyright (c) 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

function makeUrl(url) {
  return `https://raw.githubusercontent.com/uber-web/probe.gl/master/${url}`;
}

export default [{
  name: 'Documentation',
  path: '/documentation',
  data: [{
    name: 'Overview',
    markdownUrl: makeUrl('docs/README.md')
  }, {
    name: 'What\'s New',
    markdownUrl: makeUrl('docs/whats-new.md')
  }, {
    name: 'Get started',
    children: [{
      name: 'Installation',
      markdownUrl: makeUrl('docs/get-started/README.md')
    }, {
      name: 'Adding Probes',
      markdownUrl: makeUrl('docs/get-started/adding-probes.md')
    }]
  }, {
    name: 'Articles',
    children: [{
      name: 'Console Logging',
      markdownUrl: makeUrl('docs/articles/about-logging.md')
    }, {
      name: 'Benchmarking',
      markdownUrl: makeUrl('docs/articles/about-benchmarking.md')
    }, {
      name: 'Testing',
      markdownUrl: makeUrl('docs/articles/about-testing.md')
    }]
  }, {
    name: 'API Reference - Logging',
    children: [{
      name: 'Log',
      markdownUrl: makeUrl('docs/api-reference/log/log.md')
    // }, {
    //   name: 'Probe',
    //   markdownUrl: makeUrl('docs/api-reference/probe.md')
    // }, {
    //   name: 'ProbeGroup',
    //   markdwnUrl: makeUrl('docs/api-reference/probe-group.md')
    // }, {
      // name: 'Error Handling (Experimenta)',
      // markdownUrl: makeUrl('docs/api-reference/log/error-handling.md')
    }]
  }, {
    name: 'API Reference - Benchmarking',
    children: [{
      name: 'Bench',
      markdownUrl: makeUrl('docs/api-reference/bench/bench.md')
    }]
  }, {
    name: 'API Reference - Testing',
    children: [{
      name: 'NodeTestDriver',
      markdownUrl: makeUrl('docs/api-reference/test/node-test-driver.md')
    }, {
      name: 'makeSpy',
      markdownUrl: makeUrl('docs/api-reference/test/make-spy.md')
    }]
  }]
}];
