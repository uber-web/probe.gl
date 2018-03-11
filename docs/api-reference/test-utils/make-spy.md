# makeSpy

A spy utility that wraps a function. The wrapper is invisible: when called the wrapper calls the original function and returns the return value.

However it also updates certain metadata that can be inspected later, that:
* lets you determine if the wrapped function or method was actually called during exectution of other code.
* allows you to inspect how many times it was called.

There are also `restore` and `reset` methods that allows you to reset the test status.


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

### spy.called

Boolean, true if function was called


### spy.callCount

Number, number of times spy was called, `0` if not called


### spy.reset()

Resets the `called` and `callCount` flags (to `false` and `0`).


### spy.restore()

Removes the spy from the function being spied on

