'use strict';

const _ = require('lodash');

module.exports = normalizeConfig;

/**
 * Validate and normalize incoming module configuration
 *
 * @param {Object} config
 *
 * @return {Object}
 *
 * @throws {Error}
 */
function normalizeConfig (config = {}) {
  const {
    apiNames,
    requestTimeoutMs = normalizeConfig.REQUEST_TIMEOUT_MS,
    retries = normalizeConfig.RETRIES,
    retryTimeoutMs = normalizeConfig.RETRY_TIMEOUT_MS,
    customErrors = new Map()
  } = config;

  if (!_.isMap(apiNames) || apiNames.size === 0) {
    throw new Error(normalizeConfig.validationErrors.apiName);
  }

  if (!_.isMap(customErrors)) {
    throw new Error(normalizeConfig.validationErrors.customErrors);
  }

  return {
    apiNames,
    requestTimeoutMs: Number.parseInt(requestTimeoutMs, 10) || normalizeConfig.REQUEST_TIMEOUT_MS,
    retries: Number.parseInt(retries, 10) || normalizeConfig.RETRIES,
    retryTimeoutMs: Number.parseInt(retryTimeoutMs, 10) || normalizeConfig.RETRY_TIMEOUT_MS,
    customErrors
  };
}

normalizeConfig.REQUEST_TIMEOUT_MS = 10000;
normalizeConfig.RETRIES = 2;
normalizeConfig.RETRY_TIMEOUT_MS = 2000;

normalizeConfig.validationErrors = {
  apiName: 'apiNames must be a Map with at least one entry',
  customErrors: 'customErrors must be a Map'
};
