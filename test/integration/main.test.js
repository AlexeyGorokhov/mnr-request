'use strict';

const test = require('tape');

const mnrRequest = require('../../index');

const TIMEOUT_MS = 5000;
const CUSTOM_ERROR_CODE = 409;
const CUSTOM_ERROR_NAME = 'ConflictError';

const config = {
  apiNames: new Map([
    ['httpbin', 'https://httpbin.org'],
    ['not-existng', 'https://httpbin.notexisting']
  ]),
  requestTimeoutMs: TIMEOUT_MS,
  retries: 1,
  retryTimeoutMs: 500,
  customErrors: new Map([
    [CUSTOM_ERROR_CODE, { name: CUSTOM_ERROR_NAME, message: 'foo' }]
  ])
};

const reqData = { foo: 'bar' };

const request = mnrRequest(config);

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

test(`custom errory response status code`, async t => {
  try {
    const opts = {
      apiName: 'httpbin',
      path: `/status/${CUSTOM_ERROR_CODE}`,
      method: 'GET'
    };

    await request(opts);

    t.end(new Error('has not expected to succeed'));
  } catch (err) {
    t.equal(
      err.name,
      CUSTOM_ERROR_NAME,
      'should reject with custom error'
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
