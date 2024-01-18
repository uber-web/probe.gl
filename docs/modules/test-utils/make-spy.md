# makeSpy

A spy utility that wraps a function. The wrapper is invisible: when called the wrapper calls the original function and returns the return value.

However it also updates certain metadata that can be inspected later, that:
* lets you determine if the wrapped function or method was actually called during execution of other code.
* allows you to inspect how many times it was called.

Spies also have facilities for mocking, allowing the test suite to override the functions return value to trigger certain conditions.

There are also `restore` and `reset` methods that allows you to reset the test status.


## Usage

Override function return value
```ts
import {makeSpy} from '@probe.gl/test-utils';
const spy = makeSpy(Class, 'method');
spy.returns(false);
// Call code that calls the wrapped method.
```

## Function

### makeSpy

Signatures
* `spy()` - just an empty function
* `spy(func)` - wraps a function
* `spy(obj, func)` - wraps a method

Attach a spy to the function. The spy has the following methods and fields
 * `called` - whether spy was called
 * `callCount` - number of calls
 * `restore()` - remove spy completely
 * `reset()` - reset call count


## Methods and fields on the Wrapped Function

### called

Boolean, true if function was called

### callCount

Number, number of times spy was called, `0` if not called

### reset()

Resets the `called` and `callCount` flags (to `false` and `0`).

### returns

```ts
spy.returns(returnValue)
```

Makes the wrapper function return the given value without calling the wrapped function.

### restore

```ts
spy.restore()
```

Removes the spy from the function being spied on.

