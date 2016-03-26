'use strict';

var supertest = require('supertest');
var agent = supertest.agent('http://localhost:3000');
var app = require('../server/server');

module.exports = {
	run: function(confFile, callback) {
		var server;
		var conf = require(confFile);
		var baseURL = '/api/';

		if (typeof conf !== 'object') {
			return callback('Failed to load test configuration from file');
		}

		before(function(done) {
			server = app.listen(done);
		});

		after(function(done) {
			server.close(done);
		});


		describe('Loopback API', function() {
			for (var i = 0; i < conf.length; i++) {
				var c = conf[i];

				if (!c.hasOwnProperty('method')) {
					return callback('Test has no method specified');
				}

				if (!c.hasOwnProperty('model')) {
					return callback('Test has no route specified');
				}

				if (!c.hasOwnProperty('expect')) {
					return callback('Test has no expected response code specified');
				}

				var description = 'should respond '+c.expect+' on '+c.method+' requests to /'+c.model;

				var parsedMethod;

				if (c.method === 'GET') {
					parsedMethod = agent.get(baseURL+c.model);
				} else if (c.method === 'POST') {
					parsedMethod = agent.post(baseURL+c.model);
				}

				if (typeof parsedMethod === 'undefined') {
					return callback('Test has an unrecognized method type');
				}

				it(description, function(done) {
					parsedMethod
					.expect(c.expect)
					.end(function(err, res) {
						if (err) {
							return done(err);
						} else {
							return done();
						}
					});
				});
			}
		});
	}
}