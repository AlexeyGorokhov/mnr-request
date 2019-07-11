'use strict';

const normalizeNumber = require('./util/normalize-number');
const normalizeMap = require('./util/normalize-map');

const REQUEST_TIMEOUT_MS = 10000;
const RETRIES = 2;
const RETRY_TIMEOUT_MS = 2000;

/**
 * Normalize global options
 *
 * @param {Object} globalOptions
 *     @prop {Integer?} requestTimeoutMs
 *     @prop {Integer?} retries
 *     @prop {Integer?} retryTimeoutMs
 *     @prop {Map<Integer, Object>?} customErrors
 *
 * @return {Object}
 *     @prop {Integer} requestTimeoutMs
 *     @prop {Integer} retries
 *     @prop {Integer} retryTimeoutMs
 *     @prop {Map<Integer, Object>} customErrors
 */
module.exports = function normalizeGlobalOptions (globalOptions = {}) {
  const {
    requestTimeoutMs,
    retries,
    retryTimeoutMs,
    customErrors
  } = globalOptions;

  return {
    requestTimeoutMs: normalizeNumber(requestTimeoutMs, REQUEST_TIMEOUT_MS),
    retries: normalizeNumber(retries, RETRIES),
    retryTimeoutMs: normalizeNumber(retryTimeoutMs, RETRY_TIMEOUT_MS),
    customErrors: normalizeMap(customErrors)
  };
};
