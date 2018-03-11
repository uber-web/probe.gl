# Browser Driver Communication

## Functions

### callExposedFunction

Calls a function exposed in the browser

`callExposedFunction({status, failedTest, exposedFunction = 'testComplete'})`

Parameters
* `status` (`Boolean`)
* `failedTest` (`String`)
* `exposedFunction`=`'taskComplete'`

Notes:
* Serializes data using JSON.stringify
* If function is not exposed, sets a timer and tries again.
