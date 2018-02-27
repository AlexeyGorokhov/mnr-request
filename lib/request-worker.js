'use strict';

const stampit = require('stampit');
const rp = require('request-promise-native');
const VError = require('verror');

module.exports = stampit()
  .props({
    counter: 0
  })
  .methods({
    send,
    getRequestInfo
  })
  .init(function ({ requestOptions, resolve, reject }) {
    this.requestOptions = requestOptions;
    this.resolve = resolve;
    this.reject = reject;
  });

async function send () {
  try {
    this.counter++;

    const res = await rp(this.requestOptions);

    const customError = this.customErrors.get(res.statusCode);

    if (customError) {
      return this.reject(new VError(
        {
          name: customError.name
        },
        customError.message
      ));
    }

    if (res.statusCode >= 500) {
      if (this.counter <= this.retries) {
        setTimeout(() => this.send(), this.retryTimeoutMs);
        return;
      }

      return this.reject(new VError(
        {
          name: 'ServiceUnavailable',
          info: this.getRequestInfo()
        },
        'request failed due to service unavailable'
      ));
    }

    if (res.statusCode >= 400 && res.statusCode < 500) {
      return this.reject(new VError(
        {
          name: 'UnexpectedError',
          info: this.getRequestInfo()
        },
        'request unexpectedly failed'
      ));
    }

    this.resolve(res.body);
  } catch (err) {
    if (this.counter <= this.retries) {
      setTimeout(() => this.send(), this.retryTimeoutMs);
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
}

function getRequestInfo () {
  const {
    uri,
    method,
    qs = null,
    body = null
  } = this.requestOptions;

  return {
    uri,
    method,
    qs,
    body,
    retryCounter: this.counter
  };
}
