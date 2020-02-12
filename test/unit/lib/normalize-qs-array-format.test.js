'use strict';

const test = require('tape');

const {
  normalizeQsArrayFormat: self,
  validQsArrayFormats,
  defaultQsArrayFormat
} = require('../../../lib/normalize-qs-array-format');

const mn = 'lib/normalize-qs-array-format';

const validCases = validQsArrayFormats.map(format => [format, format]);

const cases = [
  ...validCases,
  ['another_value', defaultQsArrayFormat],
  [undefined, defaultQsArrayFormat]
];

for (const [ valueStub, expected ] of cases) {
  test(`${mn} > given ${valueStub}`, t => {
    const result = self(valueStub);

    t.equal(
      result,
      expected,
      `should return ${expected}`
    );

    t.end();
  });
}
