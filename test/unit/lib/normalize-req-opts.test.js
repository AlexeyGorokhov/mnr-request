'use strict';

const test = require('tape');

const self = require('../../../lib/normalize-req-opts');

const mn = 'lib/normalize-req-opts';

test(`${mn} > called without a param`, t => {
  const expectedReturnVal = {
    apiName: '',
    path: '/',
    method: 'GET',
    headers: null,
    qs: null,
    body: null
  };

  const actualReturnVal = self();

  t.deepEqual(
    actualReturnVal,
    expectedReturnVal,
    'should set correct defaults'
  );

  t.end();
});

test(`${mn} > given path with leading "/"`, t => {
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
