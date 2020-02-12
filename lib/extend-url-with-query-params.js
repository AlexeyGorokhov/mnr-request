'use strict';

const { stringify } = require('qs');

/**
 * Extend URL with query parameters is any
 *
 * @param {String} url
 * @param {Object?} qs
 * @param {String?} qsArrayFormat
 *
 * @return {String}
 */
module.exports = function extendUrlWithQueryParams (url, qs, qsArrayFormat) {
  if (qs) {
    return url + `?${stringify(qs, { arrayFormat: qsArrayFormat })}`;
  }

  return url;
};
