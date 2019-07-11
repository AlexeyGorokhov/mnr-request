'use strict';

const fetch = require('node-fetch');
const VError = require('verror');

/**
 * Make a request attempt
 *
 * @this {RequestWorker}
 *
 * @return {Promise<Void>}
 */
module.exports = async function send () {
  let statusCode;

  try {
    this.counter++;

    const res = await fetch(this.url, this.fetchOptions);

    statusCode = res.status;
    const customError = this.getCustomError(statusCode);

    if (customError) {
      this.reject(new VError(
        {
          name: customError.name
        },
        customError.message
      ));

      return;
    }

    let body = null;
    try {
      body = await res.json();
    } catch (_) {}

    if (statusCode >= 500) {
      if (this.assertShouldRetry(statusCode, body)) {
        this.makeRetry();
        return;
      }

      this.reject(new VError(
        {
          name: 'ServiceUnavailable',
          info: this.getRequestInfo()
        },
        'request failed due to service being unavailable'
      ));

      return;
    }

    if (statusCode >= 400 && statusCode < 500) {
      this.reject(new VError(
        {
          name: 'UnexpectedError',
          info: this.getRequestInfo()
        },
        'request unexpectedly failed'
      ));

      return;
    }

    this.resolve(body);
  } catch (err) {
    if (this.assertShouldRetry(statusCode)) {
      this.makeRetry();
      return;
    }

    this.reject(new VError(
      {
        name: 'NetworkError',
        cause: err,
        info: this.getRequestInfo()
      },
      'request failed due to a technical reason'
    ));
  }
};
