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
