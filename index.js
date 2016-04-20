/*!
 * base-runtimes <https://github.com/jonschlinkert/base-runtimes>
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./utils');

module.exports = function(config) {
  config = config || {};

  return function baseRuntimes(app) {
    if (!isValidInstance(app)) return;
    var time = new utils.Time();

    this.on('starting', function(build) {
      if (!silent(build)) {
        var val = namespace(build);
        starting(val ? (val + ' generator') : '');
      }
    });

    this.on('finished', function(build) {
      if (!silent(build)) {
        var val = namespace(build);
        finished(val ? (val + ' generator') : '');
      }
    });

    this.on('task:starting', function(task) {
      if (!silent(app, task)) {
        if (task.name === 'noop') return;
        starting(namespace(app), name(task) + ' task');
      }
    });

    this.on('task:finished', function(task) {
      if (!silent(app, task)) {
        if (task.name === 'noop') return;
        finished(namespace(app), name(task) + ' task');
      }
    });

    this.once('done', function() {
      utils.timestamp('finished', utils.green(utils.check));
    });

    function silent(app, task) {
      if (app.options.silent === true) {
        return true;
      }
      if (task && task.options.silent === true) {
        return true;
      }
    }

    function starting(namespace, name) {
      var key = toKey(namespace, name);
      time.start(key);
      utils.timestamp('starting', key);
    }

    function finished(namespace, name) {
      var key = toKey(namespace, name);
      var prefix = key ? key + ' ' : '';
      utils.timestamp('finished', prefix + utils.magenta(time.end(key)));
    }

    function name(task) {
      return task.name || '';
    }

    function namespace(build) {
      return build.namespace;
    }

    function toKey(namespace, name) {
      var res = '';
      if (namespace) {
        namespace = stripDefault(namespace);
      }
      if (namespace && name) {
        res = utils.bold(utils.cyan(namespace)) + ':' + utils.yellow(name);

      } else if (namespace) {
        res = utils.bold(utils.cyan(namespace));

      } else if (name) {
        res = utils.cyan(name);
      }
      return res;
    }

    return baseRuntimes;
  };
};

function stripDefault(name) {
  if (name.indexOf('default.') === 0) {
    return name.slice('default.'.length);
  }
  return name;
}

function isValidInstance(app) {
  if (app.isRegistered('base-runtimes')) {
    return false;
  }
  if (app.isCollection || app.isView) {
    return false;
  }
  var fn = app.options.validatePlugin;
  if (typeof fn === 'function') {
    return fn(app);
  }
  return true;
}
