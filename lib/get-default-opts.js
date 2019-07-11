'use strict';

/**
 * Factory creating default options for API or request
 *
 * @return {Object}
 *     @prop {null} requestTimeoutMs
 *     @prop {null} retries
 *     @prop {null} retryTimeoutMs
 *     @prop {Map} customErrors
 */
module.exports = function getDefaultOpts () {
  return {
    requestTimeoutMs: null,
    retries: null,
    retryTimeoutMs: null,
    customErrors: new Map()
  };
};
