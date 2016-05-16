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
    base.isApp = true;
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
    base.isApp = true;
    base.on('plugin', function() {
      count++;
    });

    base.use(runtimes());
    base.use(runtimes());
    base.use(runtimes());
    base.use(runtimes());
    assert.equal(count, 1);
  });

  it('should display runtimes for tasks', function(cb) {
    base.task('default', function(cb) {
      cb();
    });

    // run the `default` task
    base.build('default', function(err) {
      if (err) throw err;
      cb();
    });
  });

  it('should log `starting` for a build', function(cb) {
    var error = console.error;
    var count = 0;
    var msgs = [];

    console.error = function(time, msg) {
      msgs.push(msg);
      count++;
    };

    base = new Base();
    base.isApp = true;
    base.use(task());
    base.use(runtimes());
    base.task('default', function(next) {
      next();
    });

    // run the `default` task
    base.build(function(err) {
      if (err) throw err;
      base.emit('done');
      assert.equal(msgs[0], 'starting');
      assert.equal(count, 5);
      cb();
    });
  });

  it('should log `starting` for a task', function(cb) {
    var error = console.error;
    var count = 0;
    var msgs = [];

    console.error = function(time, msg) {
      msgs.push(msg);
      count++;
    };

    base = new Base();
    base.isApp = true;
    base.use(task());
    base.use(runtimes());
    base.task('default', function(next) {
      next();
    });

    // run the `default` task
    base.build(function(err) {
      if (err) throw err;
      base.emit('done');
      assert.equal(msgs[1], 'starting');
      assert.equal(count, 5);
      cb();
    });
  });

  it('should not log for a task when `silent` is true', function(cb) {
    var error = console.error;
    var count = 0;
    var msgs = [];

    console.error = function(time, msg) {
      msgs.push(msg);
      count++;
    };

    base = new Base();
    base.isApp = true;
    base.use(task());
    base.use(runtimes());
    base.task('default', {silent: true}, function(next) {
      next();
    });

    // run the `default` task
    base.build(['default'], function(err) {
      if (err) throw err;
      base.emit('done');
      assert.equal(count, 3);
      cb();
    });
  });

  it('should override `silent` when `verbose` is true', function(cb) {
    var error = console.error;
    var count = 0;
    var msgs = [];

    console.error = function(time, msg) {
      msgs.push(msg);
      count++;
    };

    base = new Base({}, {verbose: true});
    base.isApp = true;
    base.use(task());
    base.use(runtimes());
    base.task('default', {silent: true}, function(next) {
      next();
    });

    // run the `default` task
    base.build(['default'], function(err) {
      if (err) throw err;
      base.emit('done');
      assert.equal(count, 5);
      cb();
    });
  });

  it('should log `finished` for a task', function(cb) {
    var error = console.error;
    var count = 0;
    var msgs = [];

    console.error = function(time, msg) {
      msgs.push(msg);
      count++;
    };

    base = new Base();
    base.isApp = true;
    base.use(task());
    base.use(runtimes());
    base.task('default', function(next) {
      next();
    });

    // run the `default` task
    base.build(function(err) {
      if (err) throw err;
      base.emit('done');
      assert.equal(msgs[2], 'finished');
      assert.equal(count, 5);
      cb();
    });
  });

  it('should log `finished` for a build', function(cb) {
    var error = console.error;
    var count = 0;
    var msgs = [];

    console.error = function(time, msg) {
      msgs.push(msg);
      count++;
    };

    base = new Base();
    base.isApp = true;
    base.use(task());
    base.use(runtimes());
    base.task('default', function(next) {
      next();
    });

    // run the `default` task
    base.build(function(err) {
      if (err) throw err;
      base.emit('done');
      assert.equal(msgs[3], 'finished');
      assert.equal(count, 5);
      cb();
    });
  });

  it('should log `finished` when `done` is emitted', function(cb) {
    var error = console.error;
    var count = 0;
    var msgs = [];

    console.error = function(time, msg) {
      msgs.push(msg);
      count++;
    };

    base = new Base();
    base.isApp = true;
    base.use(task());
    base.use(runtimes());
    base.task('default', function(next) {
      next();
    });

    // run the `default` task
    base.build(function(err) {
      if (err) throw err;
      base.emit('done');
      assert.equal(msgs[4], 'finished');
      assert.equal(count, 5);
      cb();
    });
  });
});
