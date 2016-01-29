'use strict';

/**
 * Module dependencies
 */

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('ansi-cyan', 'cyan');
require('ansi-green', 'green');
require('ansi-magenta', 'magenta');
require('fancy-log', 'timestamp');
require('success-symbol', 'check');
require('time-diff', 'Time');
require = fn;

/**
 * Expose `utils` modules
 */

module.exports = utils;
