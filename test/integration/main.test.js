'use strict';

const test = require('tape');
const proxyquire = require('proxyquire').noPreserveCache();

const mnrRequest = proxyquire('../../index', {});

const TIMEOUT_MS = 3000;
const GLOBAL_CUSTOM_ERROR_CODE = 409;
const GLOBAL_CUSTOM_ERROR_NAME = 'ConflictError';
const API_CUSTOM_ERROR_CODE = 401;
const API_CUSTOM_ERROR_NAME = 'UnauthorizedError';
const REQ_CUSTOM_ERROR_CODE = 402;
const REQ_CUSTOM_ERROR_NAME = 'RequestSpecificError';

const apiOptions = {
  customErrors: new Map([
    [API_CUSTOM_ERROR_CODE, { name: API_CUSTOM_ERROR_NAME, message: 'foo' }]
  ])
};

const apis = new Map([
  ['httpbin', {
    baseUrl: 'https://httpbin.org',
    apiOptions
  }],
  ['not-existng', { baseUrl: 'https://httpbin.notexisting' }]
]);

const globalOptions = {
  requestTimeoutMs: TIMEOUT_MS,
  retries: 1,
  retryTimeoutMs: 500,
  customErrors: new Map([
    [GLOBAL_CUSTOM_ERROR_CODE, { name: GLOBAL_CUSTOM_ERROR_NAME, message: 'foo' }]
  ])
};

const reqData = { foo: 'bar' };

const request = mnrRequest(apis, globalOptions);

test(`normal GET`, async t => {
  try {
    const opts = {
      apiName: 'httpbin',
      path: '/get',
      method: 'GET',
      qs: reqData
    };

    const result = await request(opts);

    t.deepEqual(
      result.args,
      reqData,
      'should succeed'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test(`normal POST`, async t => {
  try {
    const opts = {
      apiName: 'httpbin',
      path: '/post',
      method: 'POST',
      body: reqData
    };

    const result = await request(opts);

    t.deepEqual(
      result.json,
      reqData,
      'should succeed'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test(`normal PATCH`, async t => {
  try {
    const opts = {
      apiName: 'httpbin',
      path: '/patch',
      method: 'PATCH',
      body: reqData
    };

    const result = await request(opts);

    t.deepEqual(
      result.json,
      reqData,
      'should succeed'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test(`response without body`, async t => {
  try {
    const opts = {
      apiName: 'httpbin',
      path: '/status/200',
      method: 'GET'
    };

    const result = await request(opts);

    t.deepEqual(
      result,
      null,
      'should succeed with response data set to null'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test('sending user defined headers', async t => {
  try {
    const HEADER_NAME = 'Header-Name';
    const HEADER_VAL = 'Header value';
    const opts = {
      apiName: 'httpbin',
      path: '/headers',
      method: 'GET',
      headers: {
        [HEADER_NAME]: HEADER_VAL
      }
    };

    const result = await request(opts);

    t.equal(
      result.headers[HEADER_NAME],
      HEADER_VAL,
      'should send headers'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test(`request fails due to technical reason`, async t => {
  try {
    const opts = {
      apiName: 'not-existng',
      path: '/post',
      method: 'POST',
      body: reqData
    };

    await request(opts);

    t.end(new Error('has not expected to succeed'));
  } catch (err) {
    t.equal(
      err.name,
      'NetworkError',
      'should reject with NetworkError'
    );

    t.end();
  }
});

test(`custom errory response status code defined in API settings`, async t => {
  try {
    const opts = {
      apiName: 'httpbin',
      path: `/status/${API_CUSTOM_ERROR_CODE}`,
      method: 'GET'
    };

    await request(opts);

    t.end(new Error('has not expected to succeed'));
  } catch (err) {
    t.equal(
      err.name,
      API_CUSTOM_ERROR_NAME,
      'should reject with API custom error'
    );

    t.end();
  }
});

test(`custom errory response status code defined in request settings`, async t => {
  try {
    const opts = {
      apiName: 'httpbin',
      path: `/status/${REQ_CUSTOM_ERROR_CODE}`,
      method: 'GET',
      requestOptions: {
        customErrors: new Map([
          [REQ_CUSTOM_ERROR_CODE, { name: REQ_CUSTOM_ERROR_NAME, message: 'foo' }]
        ])
      }
    };

    await request(opts);

    t.end(new Error('has not expected to succeed'));
  } catch (err) {
    t.equal(
      err.name,
      REQ_CUSTOM_ERROR_NAME,
      'should reject with request custom error'
    );

    t.end();
  }
});

test(`custom errory response status code defined in global settings`, async t => {
  try {
    const opts = {
      apiName: 'httpbin',
      path: `/status/${GLOBAL_CUSTOM_ERROR_CODE}`,
      method: 'GET'
    };

    await request(opts);

    t.end(new Error('has not expected to succeed'));
  } catch (err) {
    t.equal(
      err.name,
      GLOBAL_CUSTOM_ERROR_NAME,
      'should reject with global custom error'
    );

    t.end();
  }
});

test(`response status code 500`, async t => {
  try {
    const opts = {
      apiName: 'httpbin',
      path: `/status/500`,
      method: 'GET'
    };

    await request(opts);

    t.end(new Error('has not expected to succeed'));
  } catch (err) {
    t.equal(
      err.name,
      'ServiceUnavailable',
      'should reject with ServiceUnavailable error'
    );

    t.end();
  }
});

test(`response status code 400`, async t => {
  try {
    const opts = {
      apiName: 'httpbin',
      path: `/status/400`,
      method: 'GET'
    };

    await request(opts);

    t.end(new Error('has not expected to succeed'));
  } catch (err) {
    t.equal(
      err.name,
      'UnexpectedError',
      'should reject with UnexpectedError error'
    );

    t.end();
  }
});

test(`request timeout`, async t => {
  try {
    const opts = {
      apiName: 'httpbin',
      path: `/delay/${TIMEOUT_MS * 2}`,
      method: 'GET'
    };

    await request(opts);

    t.end(new Error('has not expected to succeed'));
  } catch (err) {
    t.equal(
      err.name,
      'NetworkError',
      'should reject with NetworkError error'
    );

    t.end();
  }
});
