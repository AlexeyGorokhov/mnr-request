'use strict';

const _ = require('lodash');

/**
 * Normalize any value to an empty Map if the value is not a Map
 *
 * @param {*} value
 *
 * @return {Map}
 */
module.exports = function normalizeMap (value) {
  return _.isMap(value) ? value : new Map();
};
