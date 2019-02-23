"use strict";var Stats;module.link('probe.gl',{Stats(v){Stats=v}},0);var test;module.link('tape-catch',{default(v){test=v}},1);/* eslint-disable max-statements */



test('Stats#import', t => {
  t.equals(typeof Stats, 'function', 'Stats import OK');
  t.end();
});

test('Stats#bump', t => {
  const stats = new Stats({id: 'test'});
  t.ok(stats instanceof Stats, 'stats created successfully');
  t.doesNotThrow(() => stats.bump('test'), 'stats.bump works');
  t.doesNotThrow(() => stats.bump('test'), 'stats.bump works');
  t.doesNotThrow(() => stats.bump('test'), 'stats.bump works');
  t.end();
});

test('Stats#get()', t => {
  const stats = new Stats({id: 'test'});
  t.ok(stats instanceof Stats, 'stats created successfully');
  t.equals(stats.get('test'), 0, 'stats bump OK');
  t.doesNotThrow(() => stats.bump('test'), 'stats.bump works');
  t.equals(stats.get('test'), 1, 'stats bump OK');
  t.doesNotThrow(() => stats.bump('test'), 'stats.bump works');
  t.equals(stats.get('test'), 2, 'stats bump OK');
  t.doesNotThrow(() => stats.bump('test'), 'stats.bump works');
  t.equals(stats.get('test'), 3, 'stats bump OK');
  t.end();
});

test('Stats#reset()', t => {
  const stats = new Stats({id: 'test'});
  t.ok(stats instanceof Stats, 'stats created successfully');
  stats.bump('test');
  t.equals(stats.get('test'), 1, 'stats.reset setup OK');
  stats.reset();
  t.equals(stats.get('test'), 0, 'stats.reset OK');
  t.end();
});
