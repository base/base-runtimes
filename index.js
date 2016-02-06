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

  return function(app) {
    if (this.isRegistered('base-runtimes')) return;
    var time = new utils.Time();
    var ctor = this.constructor;
    var runner = ctor.name.toLowerCase();

    this.on('starting', function(build) {
      var val = namespace(build);
      starting(val ? (val + ' generator') : '');
    });

    this.on('finished', function(build) {
      var val = namespace(build);
      finished(val ? (val + ' generator') : '');
    });

    this.on('task:starting', function(task) {
      starting(namespace(app), name(task) + ' task');
    });

    this.on('task:finished', function(task) {
      finished(namespace(app), name(task) + ' task');
    });

    this.once('done', function() {
      utils.timestamp('finished', utils.green(utils.check));
    });

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
      return build.namespace || '';
    }

    function toKey(namespace, name) {
      if (namespace && name) {
        return utils.bold(utils.cyan(namespace)) + ':' + utils.yellow(name);
      }
      if (namespace) {
        return utils.bold(utils.cyan(namespace));
      }
      if (name) {
        return utils.cyan(name);
      }
      return '';
    }
  };
};
