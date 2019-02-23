"use strict";module.export({default:()=>assert});function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}
