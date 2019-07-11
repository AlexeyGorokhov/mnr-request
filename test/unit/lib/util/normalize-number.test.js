'use strict';

const test = require('tape');

const self = require('../../../../lib/util/normalize-number');

const mn = 'lib/util/normalize-number';

test(`${mn} > without default value`, t => {
  const values = [1, 0, -1, '1', '0', '-1', '1abc', '', 'abc', {}];
  const expected = [1, 0, null, 1, 0, null, 1, null, null, null];

  const actual = [];

  for (const value of values) {
    actual.push(self(value));
  }

  t.deepEqual(
    actual,
    expected,
    'should return correct values'
  );

  t.end();
});

test(`${mn} > with default value`, t => {
  const defaultValue = Symbol('');
  const values = [1, 0, -1, '1', '0', '-1', '1abc', '', 'abc', {}];
  const expected =
    [1, 0, defaultValue, 1, 0, defaultValue, 1, defaultValue, defaultValue, defaultValue];

  const actual = [];

  for (const value of values) {
    actual.push(self(value, defaultValue));
  }

  t.deepEqual(
    actual,
    expected,
    'should return correct values'
  );

  t.end();
});
