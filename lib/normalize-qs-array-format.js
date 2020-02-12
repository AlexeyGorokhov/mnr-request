'use strict';

const validQsArrayFormats = ['indices', 'brackets', 'repeat', 'comma'];
const defaultQsArrayFormat = 'indices';

function normalizeQsArrayFormat (value) {
  return validQsArrayFormats.includes(value)
    ? value
    : defaultQsArrayFormat;
}

module.exports = {
  normalizeQsArrayFormat,
  validQsArrayFormats,
  defaultQsArrayFormat
};
