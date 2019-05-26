'use strict';

/**
 * Normalize request options
 *
 * @param {Object} opts
 *
 * @return {Object}
 *     @prop {String} apiName Defaults to ''
 *     @prop {String} path Defaults to ''
 *     @prop {String} method Defaults to 'GET'
 *     @prop {Object} headers Defaults to null
 *     @prop {*} qs Defaults to null
 *     @prop {*} body Defaults to null
 */
module.exports = function normalizeReqOpts (opts = {}) {
  const {
    apiName = '',
    path = '',
    method = 'GET',
    headers = null,
    qs = null,
    body = null
  } = opts;

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return {
    apiName,
    path: normalizedPath,
    method,
    headers,
    qs,
    body
  };
};
