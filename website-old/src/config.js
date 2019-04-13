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

export const PROJECT_TYPE = 'github';

export const PROJECT_NAME = 'probe.gl';
export const PROJECT_ORG = 'uber-web';
export const PROJECT_URL = `https://github.com/${PROJECT_ORG}/${PROJECT_NAME}`;
export const PROJECT_DESC =
  'JavaScript Console Instrumentation and Benchmarking for Browser and Node';

export const PROJECTS = {
  'deck.gl': 'https://uber.github.io/deck.gl',
  'luma.gl': 'https://uber.github.io/luma.gl',
  'react-map-gl': 'https://uber.github.io/react-map-gl',
  'vis.gl': 'https://uber-web.github.io/vis.gl'
};

export const HOME_HEADING = 'Logging and Benchmarking for JS';

/* eslint-disable quotes */
export const HOME_BULLETS = [{
  text: 'Console-Focused Logging',
  desc: `probe.gl focuses on debug logs and instrumentation in the console\
rather than e.g. production logging to servers.`,
  img: 'images/icon-layers.svg'
}, {
  text: 'Benchmarking and Regression Testing Support',
  desc: `Benchmarking API makes it trivial to build a benchmarking suites, \
and supports comparison of test across runs.`,
  img: 'images/icon-layers.svg'
}, {
  text: 'Optimized Chrome Debugging Experience',
  desc: `Enables a clean debug experience, with full control over logs, \
allowing you to tap into Chrome's advanced console APIs when available. \
Provides fallbacks on other browsers, including Node.js.`,
  img: 'images/icon-layers.svg'
}];

export const ADDITIONAL_LINKS = [];
