'use strict';

const test = require('tape');

const self = require('../../../lib/get-api-url');

const mn = 'lib/get-api-url';

const API_NAMES = new Map([
  ['apiName1', 'foo']
]);

test(`${mn} > passed incorrect API alias`, t => {
  t.throws(
    () => self(API_NAMES, 'name_that_definitely_does_not_exist'),
    'should throw'
  );
  t.end();
});
