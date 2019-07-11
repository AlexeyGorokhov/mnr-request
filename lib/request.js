'use strict';

const normalizeReqOpts = require('./normalize-req-opts');
const { getRequestWorkerStamp } = require('./request-worker');

/**
 * Make request
 *
 * @param {Object} opts
 *     @prop {String} apiName Alias to base URL
 *     @prop {String?} path Relative endpoint path. May or may not start with '/'. Optional.
 *           Defaults to an empty string
 *     @prop {String?} method HTTP method name. Optional. Defaults to 'GET'
 *     @prop {Object?} headers Collection of request headers. Optional
 *     @prop {Object?} qs Data to be sent in the query string. Optional
 *     @prop {Any?} body Any JSON-serializable data to be sent in the request body. Optional
 *     @prop {Object?} requestOptions Request specific options. Optional. Each option is
 *         optional as well, and if provided, it overrides the corresponding global option
 *         or the corresponding API specific option
 *         @prop {Integer?} requestTimeoutMs
 *         @prop {Integer?} retries
 *         @prop {Integer?} retryTimeoutMs
 *         @prop {Map<Integer, Object>?} customErrors
 *             @key {Integer} Response status code
 *             @value {Object}
 *                 @prop {String} name Error name
 *                 @prop {String} message Error message
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
module.exports = function request (opts) {
  const {
    apiName,
    path,
    method,
    headers,
    qs,
    body,
    requestOptions
  } = normalizeReqOpts(opts);

  const options = {
    apiName,
    path,
    method,
    headers,
    ...(qs ? { qs } : {}),
    ...(body ? { body } : {}),
    requestOptions
  };

  const Worker = getRequestWorkerStamp();

  return new Promise((resolve, reject) => {
    Worker({ options, resolve, reject }).send();
  });
};
