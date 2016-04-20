'use strict';

require('mocha');
var assert = require('assert');
var runtimes = require('./');
var task = require('base-task');
var Base = require('base');
var base;

describe('base-runtimes', function() {
  beforeEach(function() {
    base = new Base();
    base.use(task());
    base.use(runtimes());
  });

  it('should export a function', function() {
    assert.equal(typeof runtimes, 'function');
  });

  it('should register the plugin', function() {
    assert(base.isRegistered('base-runtimes'));
  });

  it('should not register the plugin more than once', function() {
    var count = 0;
    base = new Base();
    base.on('plugin', function() {
      count++;
    });

    base.use(runtimes());
    base.use(runtimes());
    base.use(runtimes());
    base.use(runtimes());
    assert.equal(count, 1);
  });

  it('should display runtimes', function(cb) {
    base.task('default', function(cb) {
      cb();
    });

    // run the `default` task
    base.build('default', function(err) {
      if (err) throw err;
      cb();
    });
  });

  it('should log `finished`', function(cb) {
    var error = console.error;
    var count = 0;

    console.error = function(time, msg) {
      count++;
    };

    base = new Base();
    base.use(task());
    base.use(runtimes());
    base.task('default', function(next) {
      next();
    });

    // run the `default` task
    base.build('default', function(err) {
      if (err) throw err;
      base.emit('done');
      assert.equal(count, 5);
      cb();
    });
  });
});
