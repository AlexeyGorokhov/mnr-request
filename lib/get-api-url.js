'use strict';

/**
 * Get full URL
 *
 * @param {Map} apiNames
 * @param {String} apiName
 *
 * @return {String}
 */
module.exports = function getApiUrl (apiNames, apiName) {
  const apiUrl = apiNames.get(apiName);

  if (!apiUrl) {
    throw new Error('Unknown API alias');
  }

  return apiUrl;
};
