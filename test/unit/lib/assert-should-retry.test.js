'use strict';

const test = require('tape');

const self = require('../../../lib/assert-should-retry');

const mn = 'lib/assert-should-retry';

test(`${mn} > retries not exceeded, status is 503 with retry: false`, t => {
  const thisStub = {
    counter: 2,
    getRetriesSetting: () => 2
  };
  const statusCode = 503;
  const body = {
    retry: false
  };
  const selfMock = self.bind(thisStub);

  const result = selfMock(statusCode, body);

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
    getRetriesSetting: () => 2
  };
  const statusCode = 503;
  const body = {
    retry: 'false'
  };
  const selfMock = self.bind(thisStub);

  const result = selfMock(statusCode, body);

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
    getRetriesSetting: () => 2
  };
  const statusCode = 503;
  const body = {};
  const selfMock = self.bind(thisStub);

  const result = selfMock(statusCode, body);

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
    getRetriesSetting: () => 2
  };
  const statusCode = 503;
  const body = null;
  const selfMock = self.bind(thisStub);

  const result = selfMock(statusCode, body);

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
    getRetriesSetting: () => 2
  };
  const statusCode = 500;
  const body = { retry: false };
  const selfMock = self.bind(thisStub);

  const result = selfMock(statusCode, body);

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
    getRetriesSetting: () => 2
  };
  const statusCode = 505;
  const body = null;
  const selfMock = self.bind(thisStub);

  const result = selfMock(statusCode, body);

  t.equal(
    result,
    false,
    'should return false'
  );

  t.end();
});
