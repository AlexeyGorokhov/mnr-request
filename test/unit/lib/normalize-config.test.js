'use strict';

const test = require('tape');
const _ = require('lodash');

const normalizeConfig = require('../../../lib/normalize-config');

const mn = 'lib/normalize-config';

const apiNames = new Map([
  ['foo', 'bar']
]);
const NOT_PARSEABLE_TO_INT = 'foo';
const PARSEABLE_TO_INT_PART = 123;
const PARSEABLE_TO_INT = String(PARSEABLE_TO_INT_PART) + 'salt';

test(`${mn} > only collection of API names is passed`, t => {
  const result = normalizeConfig({ apiNames });

  t.equal(
    result.requestTimeoutMs,
    normalizeConfig.REQUEST_TIMEOUT_MS,
    'should set default value for request timeout'
  );

  t.equal(
    result.retries,
    normalizeConfig.RETRIES,
    'should set default value for number of retries'
  );

  t.equal(
    result.retryTimeoutMs,
    normalizeConfig.RETRY_TIMEOUT_MS,
    'should set default value for retry timeout'
  );

  t.equal(
    _.isMap(result.customErrors) && result.customErrors.size === 0,
    true,
    'should set empty Map as default value for custom errors collection'
  );

  t.end();
});

test(`${mn} > API names is not passed`, t => {
  t.throws(
    () => normalizeConfig(),
    RegExp(normalizeConfig.validationErrors.apiName),
    'should throw correct error'
  );

  t.end();
});

test(`${mn} > passed an empty collection as API names`, t => {
  const apiNames = new Map();

  t.throws(
    () => normalizeConfig({ apiNames }),
    RegExp(normalizeConfig.validationErrors.apiName),
    'should throw correct error'
  );

  t.end();
});

test(`${mn} > request timeout passed is not parseable to Integer`, t => {
  const result = normalizeConfig({
    apiNames,
    requestTimeoutMs: NOT_PARSEABLE_TO_INT
  });

  t.equal(
    result.requestTimeoutMs,
    normalizeConfig.REQUEST_TIMEOUT_MS,
    'should set default value'
  );

  t.end();
});

test(`${mn} > request timeout passed is parseable to Integer`, t => {
  const result = normalizeConfig({
    apiNames,
    requestTimeoutMs: PARSEABLE_TO_INT
  });

  t.equal(
    result.requestTimeoutMs,
    PARSEABLE_TO_INT_PART,
    'should set parsed value'
  );

  t.end();
});

test(`${mn} > retries number passed is not parseable to Integer`, t => {
  const result = normalizeConfig({
    apiNames,
    retries: NOT_PARSEABLE_TO_INT
  });

  t.equal(
    result.retries,
    normalizeConfig.RETRIES,
    'should set default value'
  );

  t.end();
});

test(`${mn} > retries number passed is parseable to Integer`, t => {
  const result = normalizeConfig({
    apiNames,
    retries: PARSEABLE_TO_INT
  });

  t.equal(
    result.retries,
    PARSEABLE_TO_INT_PART,
    'should set parsed value'
  );

  t.end();
});

test(`${mn} > retry timeout passed is not parseable to Integer`, t => {
  const result = normalizeConfig({
    apiNames,
    retryTimeoutMs: NOT_PARSEABLE_TO_INT
  });

  t.equal(
    result.retryTimeoutMs,
    normalizeConfig.RETRY_TIMEOUT_MS,
    'should set default value'
  );

  t.end();
});

test(`${mn} > retry timeout passed is parseable to Integer`, t => {
  const result = normalizeConfig({
    apiNames,
    retryTimeoutMs: PARSEABLE_TO_INT
  });

  t.equal(
    result.retryTimeoutMs,
    PARSEABLE_TO_INT_PART,
    'should set parsed value'
  );

  t.end();
});

test(`${mn} > custom errors collection is not passed`, t => {
  const result = normalizeConfig({ apiNames });

  t.equal(
    _.isMap(result.customErrors) && result.customErrors.size === 0,
    true,
    'should set empty Map'
  );

  t.end();
});

test(`${mn} > custom errors collection passed is not a Map`, t => {
  t.throws(
    () => normalizeConfig({
      apiNames,
      customErrors: 'not_a_Map'
    }),
    RegExp(normalizeConfig.validationErrors.customErrors),
    'should throw correct error'
  );

  t.end();
});
