# Loopback API Testing #

This package is a simplififed replacement for [loopback-testing](https://github.com/strongloop/loopback-testing), which is now deprecated. It generates [Mocha](https://mochajs.org/) tests for API routes and examines their responses.

# Example Usage #

The test file (e.g. `test/loopbackAPI.test.js`)


```
var loopbackApiTesting = require('loopback-api-testing');

loopbackApiTesting.run('./apiTestConfig.json', function(err) {
	if (err) {
  		console.log(err);
  	}
});
```

The test configuration JSON file (e.g. `test/apiTestConfig.json`):

```
[
	{
		"method": "GET",
		"model": "Users",
		"expect": 401
	}
]
```

Running the tests (for example):

```
mocha --reporter spec test
```