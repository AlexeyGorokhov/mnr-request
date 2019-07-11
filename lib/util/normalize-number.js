'use strict';

/**
 * Normalize numeric value
 *
 * Returns passed default value if the passed value cannot be converted to an integer or
 * the integer is negative. 0 is a valid value, so must be returned.
 *
 * @param {*} value
 * @param {Integer?} defaultValue Optional. Defaults to null
 *
 * @return {Integer|null}
 */
module.exports = function normalizeNumber (value, defaultValue = null) {
  const parsedValue = Number.parseInt(value, 10);

  if (Number.isNaN(parsedValue) || parsedValue < 0) {
    return defaultValue;
  }

  return parsedValue;
};
