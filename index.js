/*!
 * base-runtimes <https://github.com/jonschlinkert/base-runtimes>
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./utils');

module.exports = function(options) {
  return function(app) {
    if (this.isRegistered('base-runtimes')) return;
    var time = new utils.Time();

    this.on('starting', function(build) {
      starting(namespace(build));
    });

    this.on('finished', function(build) {
      finished(namespace(build));
    });

    this.on('task:starting', function(task) {
      starting(namespace(app), name(task));
    });

    this.on('task:finished', function(task) {
      finished(namespace(app), name(task));
    });

    this.once('done', function() {
      console.error(utils.green(utils.check), 'finished');
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

    function name(app) {
      return app.name || '';
    }

    function namespace(app) {
      return app.namespace || '';
    }

    function toKey(namespace, name) {
      if (namespace && name) {
        return utils.cyan(namespace + ':' + name);
      }
      if (namespace) {
        return utils.cyan(namespace);
      }
      if (name) {
        return utils.cyan(name);
      }
      return '';
    }
  };
};
