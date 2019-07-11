'use strict';

/**
 * Get retries setting that has to be applied for the current request
 *
 * @this {RequestWorker}
 *
 * @return {Integer}
 */
module.exports = function getRetriesSetting () {
  const requestSetting = this.requestOptions.retries;

  if (requestSetting != null) {
    return requestSetting;
  }

  const apiSetting = this.apis.get(this.apiName).apiOptions.retries;

  if (apiSetting != null) {
    return apiSetting;
  }

  return this.globalOptions.retries;
};
