'use strict';

const normalizeCustomOptions = require('./normalize-custom-options');

/**
 * Normalize API data
 *
 * @param {Object} apiData
 *     @prop {String} baseUrl
 *     @prop {Object?} apiOptions
 *
 * @return {Object}
 *     @prop {String} baseUrl
 *     @prop {Object} apiOptions
 */
module.exports = function normalizeApi (apiData) {
  let { baseUrl, apiOptions } = apiData;

  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }

  apiOptions = normalizeCustomOptions(apiOptions);

  return { baseUrl, apiOptions };
};
