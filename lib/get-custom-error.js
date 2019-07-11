'use strict';

/**
 * Get custom error that has to be applied for the given response status code
 *
 * @param {Integer} statusCode
 *
 * @this {RequestWorker}
 *
 * @return {Object|null}
 *     @prop {String} name
 *     @prop {String} message
 */
module.exports = function getCustomError (statusCode) {
  const requestCustomError = this.requestOptions.customErrors.get(statusCode);

  if (requestCustomError) {
    return requestCustomError;
  }

  const apiCustomError = this.apis.get(this.apiName).apiOptions.customErrors.get(statusCode);

  if (apiCustomError) {
    return apiCustomError;
  }

  const globalCustomError = this.globalOptions.customErrors.get(statusCode);

  if (globalCustomError) {
    return globalCustomError;
  }

  return null;
};
