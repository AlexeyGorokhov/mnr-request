'use strict';

const test = require('tape');
const proxyquire = require('proxyquire').noPreserveCache();

const mn = 'lib/normalize-apis';

const getSelf = (stubs = {}) => {
  const {
    normalizeApiStub = () => Symbol('')
  } = stubs;

  return proxyquire('../../../lib/normalize-apis', {
    './normalize-api': normalizeApiStub
  });
};

test(`${mn} > APIs setting is not a Map`, t => {
  const self = getSelf();
  const apisStub = 'not_a_Map';

  t.throws(
    () => self(apisStub),
    Error,
    'should throw an Error'
  );

  try {
    self(apisStub);
  } catch (err) {
    t.equal(
      err.message,
      self.validationErrors.apisIsNotMap,
      'should throw an error with correct message'
    );

    t.end();
  }
});

test(`${mn} > APIs setting is an empty Map`, t => {
  const self = getSelf();
  const apisStub = new Map();

  t.throws(
    () => self(apisStub),
    Error,
    'should throw an Error'
  );

  try {
    self(apisStub);
  } catch (err) {
    t.equal(
      err.message,
      self.validationErrors.apisIsNotMap,
      'should throw an error with correct message'
    );

    t.end();
  }
});

test(`${mn} > APIs setting is a non-empty Map`, t => {
  const self = getSelf();
  const apisStub = new Map([
    ['foo', 'bar']
  ]);

  t.doesNotThrow(
    () => self(apisStub),
    'should not throw'
  );

  t.end();
});
