'use strict';

const normalizeConfig = require('./lib/normalize-config');
const getApiUrl = require('./lib/get-api-url');
const normalizeReqOpts = require('./lib/normalize-req-opts');
const RequestWorker = require('./lib/request-worker');

/**
 * Module configuration
 *
 * @param {Object} config Configuration object
 *     @prop {Map} apiNames Collection of aliases to base URLs
 *         @key {String} alias
 *         @value {String} base URL
 *     @prop {Integer} requestTimeoutMs Timeout in milliseconds after which a single request
 *           attempt/retry fails. Optional. Defaults to 10000 ms
 *     @prop {Integer} retries Number of retries. This number does not include the initial request.
 *           Optional.Defaults to 2. Retries happen in case of:
 *             • request fails due to a technical reason;
 *             • response status code >= 500 and no custom error is configured for such a status
 *               code.
 *     @prop {Integer} retryTimeoutMs Amount of time in milliseconds to wait before next retry.
 *           Optional. Defaults to 2000 ms.
 *     @prop {Map} customErrors Collection of custom error descriptors the promise has
 *           to reject with for defined response status codes.
 *           This overrides the default behavior of the module.
 *           Optional. Defaults to an empty collection.
 *         @key {Integer} Response status code
 *         @value {Object}
 *             @prop {String} name Error name
 *             @prop {String} message Error message
 *
 * @return {Function}
 */
module.exports = function mnrRequest (config) {
  const {
    apiNames,
    requestTimeoutMs,
    retries,
    retryTimeoutMs,
    customErrors
  } = normalizeConfig(config);

  const Worker = RequestWorker.methods({
    retries,
    retryTimeoutMs,
    customErrors
  });

  /**
   * Make request
   *
   * @param {Object} opts
   *     @prop {String} apiName Alias to base URL
   *     @prop {String} path Relative endpoint path. May or may not start with '/'. Optional.
   *           Defaults to an empty string
   *     @prop {String} method HTTP method name. Optional. Defaults to 'GET'
   *     @prop {Object} qs Data to be sent in the query string. Optional
   *     @prop {Any} body Any JSON-serializable data to be sent in the request body. Optional
   *
   * @return {Promise<Any>} JSON-parsed response data
   *
   * @throws by default
   *     @name NetworkError Request failed due to a technical reason, or any of the tries has been
   *           aborted by timeout
   *     @name ServiceUnavailable Last try has received >=500
   *     @name UnexpectedError (1) Response's status code >= 400 and <500;
   *                           (2) Something absolutely unexpected happened.
   */
  return function request (opts) {
    const {
      apiName,
      path,
      method,
      qs,
      body
    } = normalizeReqOpts(opts);

    const baseUrl = getApiUrl(apiNames, apiName);

    const requestOptions = {
      uri: baseUrl + path,
      method,
      ...(qs ? { qs } : {}),
      ...(body ? { body } : {}),
      json: true,
      resolveWithFullResponse: true,
      simple: false,
      timeout: requestTimeoutMs
    };

    return new Promise((resolve, reject) => {
      Worker({ requestOptions, resolve, reject }).send();
    });
  };
};
