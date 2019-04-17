'use strict';

/**
 * Assert that request should be retried
 *
 * @param {Object} res
 *     @prop {Integer} statusCode
 *     @prop {Object|undefined} body
 *
 * @this {RequestWorkerStamp}
 *
 * @return {Boolean}
 */
module.exports = function assertShouldRetry (res) {
  if (res.statusCode === 503 && res.body && res.body.retry === false) {
    return false;
  }

  return this.counter <= this.retries;
};
