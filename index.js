'use strict';

const { initRequestWorker } = require('./lib/request-worker');
const request = require('./lib/request');

/**
 * Factory function creating singleton instance of configured request function
 *
 * @param {Map<String, Object>} apis Collection of APIs. Item's key represents API alias.
 *     @key {String} API alias
 *     @value {Object}
 *         @prop {String} baseUrl Base URL
 *         @prop {Object?} apiOptions Options applicable to requests to this API. Optional.
 *             If not provided, global options are used. Both API options and global options
 *             might be overriden by options of a particular request
 *             @prop {Integer?} requestTimeoutMs Timeout in milliseconds after which a single
 *                 request attempt/retry fails. 0 disables the setting (OS limit applies). Optional
 *             @prop {Integer?} retries Number of retries. This number does not include
 *                 the initial request. Optional. For reasons of retries see globalOptions.reties
 *                 description
 *             @prop {Integer?} retryTimeoutMs Amount of time in milliseconds to wait before
 *                 next retry. Optional.
 *             @prop {Map<Integer, Object>?} customErrors Collection of custom error descriptors
 *                 the promise has to reject with for defined response status codes. Optional.
 *                     @key {Integer} Response status code
 *                     @value {Object}
 *                         @prop {String} name Error name
 *                         @prop {String} message Error message
 *
 * @param {Object?} globalOptions Options applicable to all requests if not explicitly
 *     overriden by options of a particular API or options of a particular request. Optional.
 *     If not provided, default options (as described below) are applied
 *     @prop {Integer?} requestTimeoutMs Timeout in milliseconds after which a single request
 *         attempt/retry fails. 0 disables the setting (OS limit applies).
 *         Optional. Defaults to 10_000 ms
 *     @prop {Integer?} retries Number of retries. This number does not include the initial request.
 *         Optional.Defaults to 2. Retries happen in case of:
 *             • request fails due to a technical reason;
 *             • response status code >= 500 and no custom error is configured for such a status
 *               code.
 *     @prop {Integer?} retryTimeoutMs Amount of time in milliseconds to wait before next retry.
 *         Optional. Defaults to 2000 ms.
 *     @prop {Map<Integer, Object>?} customErrors Collection of custom error descriptors the promise has
 *         to reject with for defined response status codes. This overrides the default
 *         behavior of the module. Optional. Defaults to an empty collection.
 *         @key {Integer} Response status code
 *         @value {Object}
 *             @prop {String} name Error name
 *             @prop {String} message Error message
 *
 * @return {Function}
 */
module.exports = function mnrRequest (apis, globalOptions) {
  initRequestWorker(apis, globalOptions);
  return request;
};
