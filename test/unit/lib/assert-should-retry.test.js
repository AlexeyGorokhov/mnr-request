'use strict';

const test = require('tape');

const self = require('../../../lib/assert-should-retry');

const mn = 'lib/assert-should-retry';

test(`${mn} > retries not exceeded, status is 503 with retry: false`, t => {
  const thisStub = {
    counter: 2,
    retries: 2
  };
  const resStub = {
    statusCode: 503,
    body: { retry: false }
  };
  const selfMock = self.bind(thisStub);

  const result = selfMock(resStub);

  t.equal(
    result,
    false,
    'should return false'
  );

  t.end();
});

test(`${mn} > retries not exceeded, status is 503 with retry: "false"`, t => {
  const thisStub = {
    counter: 2,
    retries: 2
  };
  const resStub = {
    statusCode: 503,
    body: { retry: 'false' }
  };
  const selfMock = self.bind(thisStub);

  const result = selfMock(resStub);

  t.equal(
    result,
    true,
    'should return true'
  );

  t.end();
});

test(`${mn} > retries not exceeded, status is 503 with no retry prop`, t => {
  const thisStub = {
    counter: 2,
    retries: 2
  };
  const resStub = {
    statusCode: 503,
    body: { }
  };
  const selfMock = self.bind(thisStub);

  const result = selfMock(resStub);

  t.equal(
    result,
    true,
    'should return true'
  );

  t.end();
});

test(`${mn} > retries not exceeded, status is 503 with no body`, t => {
  const thisStub = {
    counter: 2,
    retries: 2
  };
  const resStub = {
    statusCode: 503,
    body: null
  };
  const selfMock = self.bind(thisStub);

  const result = selfMock(resStub);

  t.equal(
    result,
    true,
    'should return true'
  );

  t.end();
});

test(`${mn} > retries not exceeded, status is not 503`, t => {
  const thisStub = {
    counter: 2,
    retries: 2
  };
  const resStub = {
    statusCode: 500,
    body: { retry: false }
  };
  const selfMock = self.bind(thisStub);

  const result = selfMock(resStub);

  t.equal(
    result,
    true,
    'should return true'
  );

  t.end();
});

test(`${mn} > retries exceeded, status is not 503`, t => {
  const thisStub = {
    counter: 3,
    retries: 2
  };
  const resStub = {
    statusCode: 505
  };
  const selfMock = self.bind(thisStub);

  const result = selfMock(resStub);

  t.equal(
    result,
    false,
    'should return false'
  );

  t.end();
});
