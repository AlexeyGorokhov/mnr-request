'use strict';

const test = require('tape');
const proxyquire = require('proxyquire').noPreserveCache().noCallThru();

const mn = 'lib/normalize-req-opts';

const getSelf = (stubs = {}) => {
  const {
    normalizeCustomOptionsStub = () => ({})
  } = stubs;

  return proxyquire('../../../lib/normalize-req-opts', {
    './normalize-custom-options': normalizeCustomOptionsStub
  });
};

test(`${mn} > called without a param`, t => {
  const NORMALIZED_CUSTOM_OPTIONS = Symbol('');
  const stubs = {
    normalizeCustomOptionsStub: () => NORMALIZED_CUSTOM_OPTIONS
  };
  const self = getSelf(stubs);

  const result = self();

  t.equal(
    result.apiName,
    '',
    'should normalize API name to an empty string'
  );

  t.equal(
    result.path,
    '/',
    'should normalize path to single slash'
  );

  t.equal(
    result.method,
    'GET',
    'should normalize method to GET'
  );

  t.deepEqual(
    result.headers,
    {},
    'should normalize headers collection to an empty object'
  );

  t.equal(
    result.qs,
    null,
    'should normalize query string to null'
  );

  t.equal(
    result.body,
    null,
    'should normalize body to null'
  );

  t.equal(
    result.requestOptions,
    NORMALIZED_CUSTOM_OPTIONS,
    'should normalize request options'
  );

  t.end();
});

test(`${mn} > given path with leading "/"`, t => {
  const self = getSelf();
  const PATH_BASE = 'foo';
  const expected = `/${PATH_BASE}`;

  const actual = self({ path: `/${PATH_BASE}` }).path;

  t.equal(
    actual,
    expected,
    'should not duplicate "/"'
  );

  t.end();
});

test(`${mn} > given path without leading "/"`, t => {
  const self = getSelf();
  const PATH_BASE = 'foo';
  const expected = `/${PATH_BASE}`;

  const actual = self({ path: PATH_BASE }).path;

  t.equal(
    actual,
    expected,
    'should add "/"'
  );

  t.end();
});

test(`${mn} > body object is provided`, t => {
  const self = getSelf();

  const result = self({ body: { a: 'b' } });

  t.equal(
    result.headers['Content-Type'],
    'application/json',
    'should add Content-Type header'
  );

  t.equal(
    typeof result.body,
    'string',
    'should stringify body'
  );

  t.end();
});

test(`${mn} > body object is not provided`, t => {
  const self = getSelf();

  const result = self({});

  t.equal(
    result.headers.hasOwnProperty('Content-Type'),
    false,
    'should not add Content-Type header'
  );

  t.equal(
    result.body,
    null,
    'should set body request option to null'
  );

  t.end();
});

test(`${mn} > HTTP method passed in lowercase`, t => {
  const self = getSelf();

  const result = self({ method: 'foo' });

  t.equal(
    result.method,
    'FOO',
    'should uppercase method'
  );

  t.end();
});
