'use strict';

const test = require('tape');
const proxyquire = require('proxyquire').noPreserveCache().noCallThru();

const mn = 'lib/normalize-api';

const getSelf = (stubs = {}) => {
  const {
    normalizeCustomOptionsStub = () => Symbol('')
  } = stubs;

  return proxyquire('../../../lib/normalize-api', {
    './normalize-custom-options': normalizeCustomOptionsStub
  });
};

test(`${mn} > base URL ends with "/"`, t => {
  const self = getSelf();
  const apiDataStub = { baseUrl: 'abc/' };

  const result = self(apiDataStub);

  t.equal(
    result.baseUrl.endsWith('/'),
    false,
    'should remove "/"'
  );

  t.end();
});

test(`${mn} > base URL does not end with "/"`, t => {
  const self = getSelf();
  const apiDataStub = { baseUrl: 'abc' };

  const result = self(apiDataStub);

  t.equal(
    result.baseUrl.endsWith('/'),
    false,
    'should not add "/"'
  );

  t.end();
});
