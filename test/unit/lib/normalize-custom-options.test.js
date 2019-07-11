'use strict';

const test = require('tape');
const proxyquire = require('proxyquire').noPreserveCache().noCallThru();
const sinon = require('sinon');

const mn = 'lib/normalize-custom-options';

const getSelf = (stubs = {}) => {
  const {
    getDefaultOptsStub = () => Symbol(''),
    normalizeNumberStub = () => Symbol(''),
    normalizeMapStub = () => Symbol('')
  } = stubs;

  return proxyquire('../../../lib/normalize-custom-options', {
    './get-default-opts': getDefaultOptsStub,
    './util/normalize-number': normalizeNumberStub,
    './util/normalize-map': normalizeMapStub
  });
};

test(`${mn} > options are not provided`, t => {
  const DEFAULT_OPTS = Symbol('');
  const stubs = {
    getDefaultOptsStub: sinon.spy(() => DEFAULT_OPTS)
  };
  const self = getSelf(stubs);

  const result = self();

  t.equal(
    stubs.getDefaultOptsStub.called,
    true,
    'should retrieve default options'
  );

  t.equal(
    result,
    DEFAULT_OPTS,
    'should return default options'
  );

  t.end();
});

test(`${mn} > options are provided`, t => {
  const options = {};
  const stubs = {
    getDefaultOptsStub: sinon.spy()
  };
  const self = getSelf(stubs);

  self(options);

  t.equal(
    stubs.getDefaultOptsStub.called,
    false,
    'should not retrieve default options'
  );

  t.end();
});
