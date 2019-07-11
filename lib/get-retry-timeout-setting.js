'use strict';

/**
 * Get retry timeout setting that has to be applied for the current request
 *
 * @this {RequestWorker}
 *
 * @return {Integer}
 */
module.exports = function getRetryTimeoutSetting () {
  const requestSetting = this.requestOptions.retryTimeoutMs;

  if (requestSetting != null) {
    return requestSetting;
  }

  const apiSetting = this.apis.get(this.apiName).apiOptions.retryTimeoutMs;

  if (apiSetting != null) {
    return apiSetting;
  }

  return this.globalOptions.retryTimeoutMs;
};
