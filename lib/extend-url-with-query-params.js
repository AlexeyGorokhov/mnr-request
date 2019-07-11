'use strict';

const { stringify } = require('qs');

/**
 * Extend URL with query parameters is any
 *
 * @param {String} url
 * @param {Object?} qs
 *
 * @return {String}
 */
module.exports = function extendUrlWithQueryParams (url, qs = null) {
  if (qs) {
    return url + `?${stringify(qs)}`;
  }

  return url;
};
