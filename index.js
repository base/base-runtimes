/*!
 * base-runtimes <https://github.com/jonschlinkert/base-runtimes>
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function(options) {
  var runtimes = require('composer-runtimes');

  return function(app) {
    if (this.isRegistered('base-runtimes')) return;
    this.use(runtimes({
      displayName: function(key) {
        if (typeof app.generator === 'function' && app.name !== key) {
          return app.name + ':' + key;
        }
        return key;
      }
    }));
  };
};
