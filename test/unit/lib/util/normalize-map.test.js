'use strict';

const test = require('tape');
const _ = require('lodash');

const self = require('../../../../lib/util/normalize-map');

const mn = 'lib/util/normalize-map';

test(`${mn} > passed value is a Map`, t => {
  const value = new Map();

  const result = self(value);

  t.equal(
    result,
    value,
    'should return unchanged value'
  );

  t.end();
});

test(`${mn} > passed value is not a Map`, t => {
  const value = 'not_a_Map';

  const result = self(value);

  t.equal(
    _.isMap(result) && result.size === 0,
    true,
    'should return a new empty Map'
  );

  t.end();
});
