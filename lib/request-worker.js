'use strict';

const stampit = require('stampit');

const normalizeApis = require('./normalize-apis');
const normalizeGlobalOptions = require('./normalize-global-options');
const assertShouldRetry = require('./assert-should-retry');
const send = require('./send');
const getCustomError = require('./get-custom-error');
const getRequestInfo = require('./get-request-info');
const getRetriesSetting = require('./get-retries-setting');
const getRetryTimeoutSetting = require('./get-retry-timeout-setting');
const getRequestTimeoutSetting = require('./get-request-timeout-setting');
const extendUrlWithQueryParams = require('./extend-url-with-query-params');

module.exports = {
  initRequestWorker,
  getRequestWorkerStamp
};

let RequestWorker;

/**
 * Initialize request worker stamp
 *
 * @param {Map<String, Object>} apis
 * @param {Object?} globalOptions
 *
 * @return {Void}
 *
 * @public
 */
function initRequestWorker (apis, globalOptions) {
  RequestWorker = stampit()
    .props({
      counter: 0
    })
    .methods({
      apis: normalizeApis(apis),
      globalOptions: normalizeGlobalOptions(globalOptions),
      send,
      getCustomError,
      assertShouldRetry,
      getRequestInfo,
      getRetriesSetting,
      getRetryTimeoutSetting,
      getRequestTimeoutSetting,
      makeRetry () {
        setTimeout(() => this.send(), this.getRetryTimeoutSetting());
      }
    })
    .init(function ({ options, resolve, reject }) {
      const {
        apiName,
        path,
        method,
        headers,
        qs,
        qsArrayFormat,
        body,
        requestOptions
      } = options;

      this.apiName = apiName;
      this.requestOptions = requestOptions;

      this.url = this.apis.get(apiName).baseUrl + path;
      this.url = extendUrlWithQueryParams(this.url, qs, qsArrayFormat);

      this.fetchOptions = {
        method,
        headers,
        body,
        timeout: this.getRequestTimeoutSetting()
      };

      this.resolve = resolve;
      this.reject = reject;
    });
}

/**
 * Return request worker stamp
 *
 * @return {RequestWorker}
 *
 * @public
 */
function getRequestWorkerStamp () {
  return RequestWorker;
}
