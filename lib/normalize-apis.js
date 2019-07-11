'use strict';

const _ = require('lodash');

const normalizeApi = require('./normalize-api');

module.exports = normalizeApis;

/**
 * Normalize APIs collection
 *
 * @param {Map<String, Object>} apis
 *
 * @return {Map<String, Object>}
 *
 * @public
 */
function normalizeApis (apis) {
  if (!_.isMap(apis) || apis.size === 0) {
    throw new Error(normalizeApis.validationErrors.apisIsNotMap);
  }

  for (const [ key, value ] of apis.entries()) {
    apis.set(key, normalizeApi(value));
  }

  return apis;
}

normalizeApis.validationErrors = {
  apisIsNotMap: 'apis parameter must be a Map with at least one entry'
};
