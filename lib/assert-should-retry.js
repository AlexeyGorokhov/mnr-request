'use strict';

/**
 * Assert that request should be retried
 *
 * @prop {Integer} statusCode
 * @prop {Object?} body
 *
 * @this {RequestWorker}
 *
 * @return {Boolean}
 */
module.exports = function assertShouldRetry (statusCode, body) {
  if (statusCode === 503 && body && body.retry === false) {
    return false;
  }

  return this.counter <= this.getRetriesSetting();
};
