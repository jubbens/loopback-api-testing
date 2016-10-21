'use strict';

var supertest = require('supertest');
var async = require('async');

module.exports = {
  run: function(conf, app, url, callback) {
    var server;
    var agent = supertest.agent(url);
    var baseURL = '/';

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
      async.each(conf, function(c, asyncCallback) {
        if (!c.hasOwnProperty('method')) {
          callback('Test has no method specified');
          return asyncCallback();
        }

        if (!c.hasOwnProperty('model')) {
          callback('Test has no route specified');
          return asyncCallback();
        }

        if (!c.hasOwnProperty('expect')) {
          callback('Test has no expected response code specified');
          return asyncCallback();
        }

        var hasData = (c.hasOwnProperty('withData'));
        var isWithAuthentication = (c.hasOwnProperty('username') && c.hasOwnProperty('password'));
        var authenticationDescription = (isWithAuthentication) ? 'authenticated' : 'unauthenticated';

        var description = 'should respond '+c.expect+' on '+authenticationDescription+' '+c.method+' requests to /'+c.model;
        var parsedMethod;

        var loginBlock = function(loginCallback) { 
          return loginCallback(null, null); 
        };

        if (c.method.toUpperCase() === 'GET') {
          parsedMethod = agent.get(baseURL+c.model);
        } else if (c.method.toUpperCase() === 'POST') {
          parsedMethod = agent.post(baseURL+c.model);
        } else if (c.method.toUpperCase() === 'PUT') {
          parsedMethod = agent.put(baseURL+c.model);
        } else if (c.method.toUpperCase() === 'DELETE') {
          parsedMethod = agent.delete(baseURL+c.model);
        } else if (c.method.toUpperCase() === 'PATCH') {
          parsedMethod = agent.patch(baseURL+c.model);
        }

        if (typeof parsedMethod === 'undefined') {
          callback('Test has an unrecognized method type');
          return asyncCallback();
        }

        if (isWithAuthentication) {
          loginBlock = function(loginCallback) {
            agent
            .post(baseURL+'users/login')
            .send({ email: c.username, password: c.password, ttl: '1209600000' })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect(200)
            .end(function(err, authRes) {
              if (err) {
                return loginCallback('Could not log in with provided credentials', null);
              }

              var token = authRes.body.id;

              return loginCallback(null, token);
            });
          }
        }

        it(description, function(done) {
          loginBlock(function(loginError, loginToken) {
            if (loginError) {
              done(loginError);
              return asyncCallback();
            }

            if (loginToken) {
              parsedMethod = parsedMethod.set('Authorization', loginToken);
            }

            if (hasData) {
              parsedMethod = parsedMethod.send(c.withData)
              .set('Content-Type', 'application/json');
            }

            parsedMethod
            .expect(c.expect)
            .end(function(err, res) {
              if (err) {
                done(err);
                return asyncCallback();
              } else {
                done();
                return asyncCallback();
              }
            });
          });
        });
      });
    });
  }
}
