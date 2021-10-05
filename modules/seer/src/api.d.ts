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

/**
 * Ready check for Seer initialization
 *
 * @returns {Boolean}
 */
export function isReady();

/**
 * Utility method allowing to throttle a user action based on a key and a minimun delay.
 *
 * @param key {String} A unique key
 * @param delay {Number} The minimal delay to throttle
 * @returns {Boolean}
 */
export function throttle(key, delay): boolean;

export function replacer(seen): any; // ((key, value): Array);

/**
 * Low-level api leveraging window.postMessage
 *
 * @param type {String} The action type
 * @param payload {Any} The action payload
 */
export function send(type: string, data?: any): void;

export function listener(message): void;

/**
 * Initilize window listener. There will be only one for the whole process
 * to prevent too many registrations.
 *
 * This method will be called automatically if you use the `listenFor` method.
 */
export function init(): void;
/**
 * Clean listener. Can be useful in case you want to unregister upcoming events
 * or liberate memory.
 */
export function clean(): void;

/**
 * Create a listener that will be called upon events of the given key.
 *
 * @param key {String} The unique tab key
 * @param cb {Function} A callback that will receive the message payload
 */
export function listenFor(type: string, cb: Function): void;

/**
 * Remove an identity listener
 *
 * @param cb {Function} The callback to remove
 */
export function removeListener(cb: Function): void;

/**
 * Creates a new indexed list.
 * It works by index to get O(1) accessing and performance.
 *
 * @param key {String} The key of the tab
 * @param data {Object} The indexed object
 */
export function list(key: string, data: object): void;

/**
 * Creates an element in the indexed list, based on the itemKey.
 *
 * @param key {String} The key of the tab
 * @param itemKey {String} The key of the item
 * @param data {Any} The value of the item
 */
export function listItem(key: string, itemKey: string, data?: any): void;

/**
 * Update an item property, can be deeply nested.
 *
 * @param key {String} The key of the tab
 * @param itemKey {String} The key of the item
 * @param path {String} The path of the variable you want to update
 * @param data {Object} The new value
 */
export function updateItem(key: string, itemKey: string, path: string, data: object): void;

/**
 * Similar to updateItem, but allows to pass an array with {path,data} pairs for
 * multiple update of the same item without having to send multiple messages.
 *
 * @param key {String} The key of the tab
 * @param itemKey {String} The key of the item
 * @param array {Array} The array of updates
 * @param array.path {String} The path for this update
 * @param array.data {Object} The value of this update
 */
export function multiUpdate(key: string, itemKey: string, array: any[]): void;

/**
 * Remove a specific item in a specific tab.
 *
 * @param key {String} They key of the tab
 * @param itemKey {String} The key of the item
 */
export function deleteItem(key: string, itemKey: string): void;

/**
 * Will create a log message to an item, that will be displayde with the current time.
 *
 * @param key {String} The key of the tab
 * @param itemKey {String} The key of the item
 * @param msg {String} The message to display
 */
export function addLog(key: string, itemKey: string, msg: string): void;
