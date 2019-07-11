'use strict';

const test = require('tape');

const self = require('../../../lib/get-retry-timeout-setting');

const mn = 'lib/get-retry-timeout-setting';

const API_NAME = 'foo';
const CUSTOM_SETTING = Symbol('');
const GLOBAL_SETTING = Symbol('');

const getDefaultThisStub = () => ({
  apiName: API_NAME,
  requestOptions: {
    retryTimeoutMs: null
  },
  apis: new Map([
    [API_NAME, {
      apiOptions: {
        retryTimeoutMs: null
      }
    }]
  ]),
  globalOptions: {
    retryTimeoutMs: GLOBAL_SETTING
  }
});

test(`${mn} > there is setting in request options`, t => {
  const thisStub = getDefaultThisStub();
  thisStub.requestOptions.retryTimeoutMs = CUSTOM_SETTING;
  const selfMock = self.bind(thisStub);

  const result = selfMock();

  t.equal(
    result,
    CUSTOM_SETTING,
    'should return setting from request options'
  );

  t.end();
});

test(`${mn} > request setting is 0`, t => {
  const thisStub = getDefaultThisStub();
  thisStub.requestOptions.retryTimeoutMs = 0;
  const selfMock = self.bind(thisStub);

  const result = selfMock();

  t.equal(
    result,
    0,
    'should return 0'
  );

  t.end();
});

test(`${mn} > there is setting in API options`, t => {
  const thisStub = getDefaultThisStub();
  thisStub.apis.get(API_NAME).apiOptions.retryTimeoutMs = CUSTOM_SETTING;
  const selfMock = self.bind(thisStub);

  const result = selfMock();

  t.equal(
    result,
    CUSTOM_SETTING,
    'should return setting from API options'
  );

  t.end();
});

test(`${mn} > API setting is 0`, t => {
  const thisStub = getDefaultThisStub();
  thisStub.apis.get(API_NAME).apiOptions.retryTimeoutMs = 0;
  const selfMock = self.bind(thisStub);

  const result = selfMock();

  t.equal(
    result,
    0,
    'should return 0'
  );

  t.end();
});

test(`${mn} > there is no custom setting`, t => {
  const thisStub = getDefaultThisStub();
  const selfMock = self.bind(thisStub);

  const result = selfMock();

  t.equal(
    result,
    GLOBAL_SETTING,
    'should return global setting'
  );

  t.end();
});
