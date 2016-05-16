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
      if (!silent(app, build, null)) {
        starting(namespace(build));
      }
    });

    this.on('finished', function(build) {
      if (!silent(app, build, null)) {
        finished(namespace(build));
      }
    });

    this.on('task:starting', function(task) {
      if (!silent(app, null, task)) {
        if (task.name === 'noop') return;
        starting(namespace(app), name(task) + ' task');
      }
    });

    this.on('task:finished', function(task) {
      if (!silent(app, null, task)) {
        if (task.name === 'noop') return;
        finished(namespace(app), name(task) + ' task');
      }
    });

    this.once('done', function() {
      utils.timestamp('finished', utils.log.success);
    });

    function starting(namespace, name) {
      var key = toKey(namespace, name);
      time.start(key);
      utils.timestamp('starting', key);
    }

    function finished(namespace, name) {
      var key = toKey(namespace, name);
      var prefix = key ? key + ' ' : '';
      utils.timestamp('finished', prefix + utils.colors.magenta(time.end(key)));
    }

    function silent(app, build, task) {
      if (app.options.verbose === true) {
        return false;
      }
      if (task && app.options.verbose === 'tasks') {
        return false;
      }
      if (build && app.options.verbose === 'build') {
        return false;
      }
      if (app.options.silent === true) {
        return true;
      }
      if (task && task.options.silent === true) {
        return true;
      }
    }

    function name(task) {
      return task.name || '';
    }

    function namespace(build) {
      return build.env ? build.env.namespace : build.namespace;
    }

    function toKey(namespace, name) {
      var res = '';
      if (namespace) {
        namespace = stripDefault(namespace);
      }
      if (namespace && name) {
        res = utils.colors.bold(utils.colors.cyan(namespace)) + ':' + utils.colors.yellow(name);

      } else if (namespace) {
        res = utils.colors.bold(utils.colors.cyan(namespace));

      } else if (name) {
        res = utils.colors.cyan(name);
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

function isValidInstance(app, fn) {
  if (!utils.isValid(app)) {
    return false;
  }
  if (utils.isRegistered(app, 'base-runtimes', fn)) {
    return false;
  }
  return true;
}
