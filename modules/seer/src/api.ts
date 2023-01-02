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

declare global {
  var __SEER_INITIALIZED__: boolean; // eslint-disable-line no-var
}

type Callback = (...args: unknown[]) => unknown;
type Listener = any;

const isBrowser = typeof window !== 'undefined' && window.addEventListener;

const timers = new Map();


const listeners = new Map<string, Listener>();

/**
 * Ready check for Seer initialization
 * @returns
 */
const isReady = (): boolean => isBrowser && globalThis.__SEER_INITIALIZED__;

/**
 * Utility method allowing to throttle a user action based on a key and a minimun delay.
 *
 * @param key  A unique key
 * @param delay { The minimal delay to throttle
 * @returns
 */
const throttle = (key: string, delay: number): boolean => {
  const time = timers.get(key);
  const now = Date.now();
  if (time && now - time < delay) {
    return true;
  }
  timers.set(key, now);
  return false;
};

const replacer =
  (seen: Set<unknown>) =>
    (key: string, value: unknown): unknown => {
      if (value && typeof value === 'object' && seen.has(value)) {
        return undefined;
      }
      seen.add(value);
      const isArray = Object.prototype.toString.call(value).slice(8, -1).includes('Array');
      if (isArray) {
        return Array.prototype.slice.call(value, 0, 20);
      }
      return value;
    };

/**
 * Low-level api leveraging window.postMessage
 *
 * @param type The action type
 * @param data The action payload
 */
const send = (type: string, data: unknown = {}): void => {
  if (!isBrowser || !isReady()) {
    return;
  }

  const seen = new Set();
  const payload = JSON.stringify(data, replacer(seen));

  try {
    window.postMessage({type, payload, source: 'seer-agent'}, '*');
  } catch (e) {
    if (throttle('seer-log', 2e3)) {
      return;
    }
    console.log(e); // eslint-disable-line
  }
};

const listener = (message: any): void => {
  if (!message || !message.data || message.data.source !== 'seer-core') {
    return;
  }
  const {type, payload} = message.data;

  const typeListeners = listeners.get(type);
  if (typeListeners) {
    typeListeners.forEach((cb: Callback) => cb(payload));
  }
};

/**
 * Initilize window listener. There will be only one for the whole process
 * to prevent too many registrations.
 *
 * This method will be called automatically if you use the `listenFor` method.
 */
const init = (): void => {
  // @ts-expect-error
  if (!isBrowser || window.__SEER_LISTENER__) {
    return;
  }
  window.addEventListener('message', listener);
  // @ts-expect-error
  window.__SEER_LISTENER__ = true;
};

/**
 * Clean listener. Can be useful in case you want to unregister upcoming events
 * or liberate memory.
 */
const clean = (): void => {
  // @ts-expect-error
  if (!isBrowser || !window.__SEER_LISTENER__) {
    return;
  }
  window.removeEventListener('message', listener);
  // @ts-expect-error
  delete window.__SEER_LISTENER__;
};

/**
 * Create a listener that will be called upon events of the given key.
 *
 * @param type The unique tab key
 * @param cb A callback that will receive the message payload
 */
const listenFor = (type: string, cb: Callback): void => {
  if (!isBrowser) {
    return;
  }
  if (!type || !cb) {
    throw new Error('Please provide a type and callback');
  }
  if (!listeners.has(type)) {
    listeners.set(type, []);
  }
  // @ts-expect-error
  if (!window.__SEER_LISTENER__) {
    init();
  }
  listeners.get(type).push(cb);
};

/**
 * Remove an identity listener
 *
 * @param cb The callback to remove
 */
const removeListener = (cb: Callback): void => {
  listeners.forEach((typeListeners, key) => {
    listeners.set(
      key,
      typeListeners.filter((l: Listener) => l !== cb)
    );
  });
};

/**
 * Creates a new indexed list.
 * It works by index to get O(1) accessing and performance.
 *
 * @param key  The key of the tab
 * @param data The indexed object
 */
const list = (key: string, data: object): void => send('LIST', {key, data});

/**
 * Creates an element in the indexed list, based on the itemKey.
 *
 * @param key The key of the tab
 * @param itemKey The key of the item
 * @param data The value of the item
 */
const listItem = (key: string, itemKey: string, data: unknown = {}): void =>
  send('LIST_ITEM', {key, itemKey, data});

/**
 * Update an item property, can be deeply nested.
 *
 * @param key The key of the tab
 * @param itemKey The key of the item
 * @param path The path of the variable you want to update
 * @param data {Object} The new value
 */
const updateItem = (key: string, itemKey: string, path: string, data: unknown): void =>
  send('UPDATE_ITEM', {key, itemKey, path, data});

/**
 * Similar to updateItem, but allows to pass an array with {path,data} pairs for
 * multiple update of the same item without having to send multiple messages.
 *
 * @param key The key of the tab
 * @param itemKey The key of the item
 * @param array {Array} The array of updates
 * @param array.path The path for this update
 * @param array.data {Object} The value of this update
 */
const multiUpdate = (key: string, itemKey: string, array: string): void =>
  send('MULTI_UPDATE_ITEM', {key, itemKey, array});

/**
 * Remove a specific item in a specific tab.
 *
 * @param key They key of the tab
 * @param itemKey The key of the item
 */
const deleteItem = (key: string, itemKey: string): void => send('DELETE_ITEM', {key, itemKey});

/**
 * Will create a log message to an item, that will be displayde with the current time.
 *
 * @param key The key of the tab
 * @param itemKey The key of the item
 * @param msg The message to display
 */
const addLog = (key: string, itemKey: string, msg: string) => send('ADD_LOG', {key, itemKey, msg});

export default {
  send,
  throttle,
  isReady,

  list,
  listItem,
  updateItem,
  multiUpdate,
  deleteItem,
  addLog,

  listeners,
  listenFor,
  removeListener,
  init,
  clean
};
