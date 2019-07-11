'use strict';

const getDefaultOpts = require('./get-default-opts');
const normalizeNumber = require('./util/normalize-number');
const normalizeMap = require('./util/normalize-map');

/**
 * Normalize custom API or request options
 *
 * @prop {Object?} opts
 *     @prop {Integer?} requestTimeoutMs
 *     @prop {Integer?} retries
 *     @prop {Integer?} retryTimeoutMs
 *     @prop {Map<Integer, Object>?} customErrors
 *
 * @return {Object}
 *     @prop {Integer|null} requestTimeoutMs
 *     @prop {Integer|null} retries
 *     @prop {Integer|null} retryTimeoutMs
 *     @prop {Map<Integer, Object>} customErrors
 */
module.exports = function normalizeCustomOptions (opts) {
  if (!opts) return getDefaultOpts();

  const {
    requestTimeoutMs,
    retries,
    retryTimeoutMs,
    customErrors
  } = opts;

  return {
    requestTimeoutMs: normalizeNumber(requestTimeoutMs),
    retries: normalizeNumber(retries),
    retryTimeoutMs: normalizeNumber(retryTimeoutMs),
    customErrors: normalizeMap(customErrors)
  };
};
