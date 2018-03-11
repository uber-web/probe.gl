// tape tests swallow console messages,
// so this scripts does some "raw" logging to check that things work.

const {Log, COLOR} = require('probe.gl');

const log = new Log({id: 'test'});
log.priority = 5;

log.log(1, 'log outside group')();

if (console.group) {
  console.group('aaa');
  console.group('aaa');
  console.log('123');
  console.groupEnd();
  console.groupEnd();
  console.log('123');
}

log.probe('test0')();
log.probe(1, 'test1')();
log.probe(2, 'test2')();
log.probe({priority: 3}, 'test3')();
log.probe({color: 'green'}, 'test-green')();
log.probe({color: COLOR.RED, message: 'test-red'})();

log.log('log test')();
log.log(0, 'log prio test')();

log.log(() => 'log func test')();
log.log(0, '() => log func prio test')();

log.once('test once')();
log.once('test once')();
log.once('test twice')();
log.once(0, 'test twice')();

log.warn('test warn')();
log.warn('test warn')();

log.error('test error')();
log.error('test error')();

log.deprecated('xfirst', 'once')();
log.deprecated('xfirst', 'once')();

log.group('test-group')();
log.log(1, 'test0')();
log.groupEnd()();

log.group('test-group-2')();
log.log(1, 'test1')();
log.group('test-group-3')();
log.log(1, 'test11')();
log.groupEnd(1)();
log.log(1, 'test1')();
log.groupEnd(1)();

log.log(1, 'log outside group')();

log.table(0, {a: {c: 1}, b: {c: 2}})();
log.table(0, {a: {c: 1}, b: {c: 2}})();

