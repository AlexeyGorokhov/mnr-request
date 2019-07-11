'use strict';

const test = require('tape');
const proxyquire = require('proxyquire').noPreserveCache().noCallThru();
const sinon = require('sinon');

const mn = 'lib/extend-url-with-query-params';

const getSelf = (stubs = {}) => {
  const {
    stringifyStub = () => ''
  } = stubs;

  return proxyquire('../../../lib/extend-url-with-query-params', {
    'qs': {
      stringify: stringifyStub
    }
  });
};

test(`${mn} > query params are passed`, t => {
  const stubs = {
    stringifyStub: sinon.spy(() => '')
  };
  const self = getSelf(stubs);

  self('some_url', {});

  t.equal(
    stubs.stringifyStub.called,
    true,
    'should invoke query params stringifier'
  );

  t.end();
});

test(`${mn} > query params are not passed`, t => {
  const stubs = {
    stringifyStub: sinon.spy(() => '')
  };
  const self = getSelf(stubs);
  const URL = 'some_url';

  const result = self(URL);

  t.equal(
    stubs.stringifyStub.called,
    false,
    'should not invoke query params stringifier'
  );

  t.equal(
    result,
    URL,
    'should return unchanged value'
  );

  t.end();
});
