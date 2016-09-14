# Loopback API Testing #
[![npm](https://img.shields.io/npm/dm/loopback-api-testing.svg)]()
[![npm](https://img.shields.io/npm/l/loopback-api-testing.svg)]()

This package is a simplified replacement for [loopback-testing](https://github.com/strongloop/loopback-testing), which is now considered deprecated. It generates [Mocha](https://mochajs.org/) tests for Loopback API routes and examines their responses.

The main difference between this package and [loopback-testing](https://github.com/strongloop/loopback-testing) is that loopback-api-testing does not require you to write any code. Tests are specified in json format and the tests are generated automatically.

This package is not supported by, endorsed by, or associated with Strongloop or the core Loopback team.

## Installing ##

```bash
npm install loopback-api-testing
```

## Example Usage ##

The test file (e.g. `test/loopbackAPI.test.js`)


```js
var loopbackApiTesting = require('loopback-api-testing');
var tests = require('./apiTestConfig.json');
var server = require('../server/server.js');
var url = 'http://localhost:3000/api';

loopbackApiTesting.run(tests, server, url, function(err) {
  if (err) {
    console.log(err);
  }
});
```

The test configuration JSON file (e.g. `test/apiTestConfig.json`):

```js
[
  {
    "method": "GET",
    "model": "Users",
    "expect": 401
  }
]
```

Running the tests (for example):

```bash
mocha --reporter spec test
```

Should get you:

```
  Loopback API
    ✓ should respond 401 on unauthenticated GET requests to /Users (67ms)


  1 passing (318ms)
```

## Making Authenticated Requests ##

You can specify a `username` and `password` in your tests to make the request as an authenticated user.

```js
[
  {
    "method": "GET",
    "model": "Cars",
    "username": "my@user.com",
    "password": "myPassword",
    "expect": 200
  }
]
```

## Making Requests with Data ##

You can send json data with a request.

```js
[
  {
    "method": "POST",
    "model": "Cars",
    "withData": {
      "color": "blue"
    },
    "expect": 200
  }
]
```

## Add you own description

You can add your own descriptions like so:

```js
[
  {
    "desc": "user can select the colour of the car",
    "method": "PUT",
    "model": "Cars",
    "withData": {
      "color": "blue"
    },
    "expect": 200
  }
]
```
