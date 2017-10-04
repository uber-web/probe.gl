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

import overview from '../../docs/README.md';
import whatsNew from '../../docs/whats-new.md';

import probe from '../../docs/api-reference/probe.md';
import probeGroup from '../../docs/api-reference/probe-group.md';
import errorHandling from '../../docs/api-reference/error-handling.md';

import install from '../../docs/get-started/README.md';
import addingProbes from '../../docs/get-started/adding-probes.md';

export default [{
  name: 'Documentation',
  path: '/documentation',
  data: [{
    name: 'Overview',
    markdown: overview
  }, {
    name: 'What\'s New',
    markdown: whatsNew
  }, {
    name: 'Get started',
    children: [{
      name: 'Installation',
      markdown: install
    }, {
      name: 'Adding Probes',
      markdown: addingProbes
    }]
  }, {
    name: 'API Reference',
    children: [{
      name: 'Probe',
      markdown: probe
    }, {
      name: 'ProbeGroup',
      markdown: probeGroup
    }, {
      name: 'Error Handling',
      markdown: errorHandling
    }]
  }]
}];
