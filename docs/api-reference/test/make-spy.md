# makeSpy

A simple spy utility that can help you determine if a function or method being tested was actually called, as well as how many times it was called.


## Function

### makeSpy

Signatures
* `spy()` - just an empty function
* `spy(func)` - wraps a function
* `spy(obj, func)` - wraps a method

Attach a spy to the function. The spy has the following methods and fields
 * `called` - whether spy was called
 * `callCount` - number of calls
 * restore() - remove spy completely
 * reset() - reset call count


## Methods and fields on the Wrapped Function

### spy.called

Boolean, true if function was called


### spy.callCount

Number, number of times spy was called, `0` if not called


### spy.reset()

Resets the `called` and `callCount` flags (to `false` and `0`).


### spy.restore()

Removes the spy from the function being spied on

