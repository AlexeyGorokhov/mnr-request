'use strict';

/**
 * Get request timeout setting that has to be applied for the current request
 *
 * @this {RequestWorker}
 *
 * @return {Integer}
 */
module.exports = function getRequestTimeoutSetting () {
  const requestSetting = this.requestOptions.requestTimeoutMs;

  if (requestSetting != null) {
    return requestSetting;
  }

  const apiSetting = this.apis.get(this.apiName).apiOptions.requestTimeoutMs;

  if (apiSetting != null) {
    return apiSetting;
  }

  return this.globalOptions.requestTimeoutMs;
};
