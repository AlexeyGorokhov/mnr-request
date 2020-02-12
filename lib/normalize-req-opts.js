'use strict';

const { normalizeQsArrayFormat } = require('./normalize-qs-array-format');
const normalizeCustomOptions = require('./normalize-custom-options');

/**
 * Normalize request options
 *
 * @param {Object} opts
 *
 * @return {Object}
 *     @prop {String} apiName Defaults to ''
 *     @prop {String} path Defaults to ''
 *     @prop {String} method Defaults to 'GET'
 *     @prop {Object} headers Defaults to {}
 *     @prop {String|null} qs Defaults to null
 *     @prop {String} qsArrayFormat Defaults to 'indices'
 *     @prop {String|null} body Defaults to null
 *     @prop {Object} requestOptions
 *         @prop {Integer|null} requestTimeoutMs
 *         @prop {Integer|null} retries
 *         @prop {Integer|null} retryTimeoutMs
 *         @prop {Map<Integer, Object>} customErrors
 */
module.exports = function normalizeReqOpts (opts = {}) {
  const {
    apiName = '',
    path = '',
    method = 'GET',
    headers = {},
    qs = null,
    body = null,
    requestOptions
  } = opts;

  let { qsArrayFormat } = opts;
  qsArrayFormat = normalizeQsArrayFormat(qsArrayFormat);

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  return {
    apiName,
    path: path.startsWith('/') ? path : `/${path}`,
    method: method.toUpperCase(),
    headers,
    qs,
    qsArrayFormat,
    body: body ? JSON.stringify(body) : null,
    requestOptions: normalizeCustomOptions(requestOptions)
  };
};
