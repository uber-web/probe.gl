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

/* global window */
function storageAvailable(type) {
  try {
    const storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return storage;
  } catch (e) {
    return null;
  }
}

export default class LocalStorage {
  /**
   * @classdesc
   * Store keys in local storage via simple interface
   *
   * @class
   * @param {Object} opts - options
   * @param {String} type='sessionStorage' -
   *    'sessionStorage' persists between reloads
   *    'localStorage' persists after browser is closed
   */
  constructor({type = 'sessionStorage'} = {}) {
    this.storage = storageAvailable(type);
    if (!this.storage) {
      throw new Error(`${type} not available`);
    }
  }

  /**
   * Sets string value for a key
   * @param {String} key - key to update
   * @param {String} value - string to be stored under key
   */
  set(key, value) {
    this.storage.setItem(key, value);
  }

  /**
   * Gets string value for a key
   * @param {String} key - key to retrieve
   * @return {String} value stored under key, or undefined
   */
  get(key) {
    return this.storage.getItem(key);
  }

  /**
   * Removed a key and its associated value
   * @param {String} key - key to remove
   */
  remove(key) {
    this.storage.removeItem(key);
  }

  getObject(key) {
    const value = this.storage.getItem(key);
    try {
      return typeof value === 'string' ? JSON.parse(value) : {};
    } catch (error) {
      this.remove(key);
      return {};
    }
  }

  setObject(key, value) {
    const string = value ? JSON.stringify(value) : null;
    this.storage.setItem(key, string);
  }
}
