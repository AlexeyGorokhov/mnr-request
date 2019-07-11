'use strict';

/**
 * Create request information object from the instance of RequestWorker
 *
 * @this {RequestWorker}
 *
 * @return {Object}
 *     @prop {String} uri
 *     @prop {String} method
 *     @prop {Object|null} body
 *     @prop {Integer} retryCounter
 */
module.exports = function getRequestInfo () {
  const {
    method,
    body = null
  } = this.fetchOptions;

  return {
    uri: this.url,
    method,
    body,
    retryCounter: this.counter
  };
};
