'use strict';

const test = require('tape');

const self = require('../../../lib/get-custom-error');

const mn = 'lib/get-custom-error';

const API_NAME = 'foo';
const STATUS_CODE = 123;

const getDefaultThisStub = () => ({
  apiName: API_NAME,
  requestOptions: {
    customErrors: new Map()
  },
  apis: new Map([
    [API_NAME, {
      apiOptions: {
        customErrors: new Map()
      }
    }]
  ]),
  globalOptions: {
    customErrors: new Map()
  }
});

const getCusomErrorEntry = () => ({
  name: Symbol(''),
  message: Symbol('')
});

test(`${mn} > there is custom error for this status code in request options`, t => {
  const thisStub = getDefaultThisStub();
  const errorEntry = getCusomErrorEntry();
  thisStub.requestOptions.customErrors.set(STATUS_CODE, errorEntry);
  const selfMock = self.bind(thisStub);

  const result = selfMock(STATUS_CODE);

  t.equal(
    result,
    errorEntry,
    'should return custom error from request options'
  );

  t.end();
});

test(`${mn} > there is custom error for this status code in API options`, t => {
  const thisStub = getDefaultThisStub();
  const errorEntry = getCusomErrorEntry();
  thisStub.apis.get(API_NAME).apiOptions.customErrors.set(STATUS_CODE, errorEntry);
  const selfMock = self.bind(thisStub);

  const result = selfMock(STATUS_CODE);

  t.equal(
    result,
    errorEntry,
    'should return custom error from API options'
  );

  t.end();
});

test(`${mn} > there is custom error for this status code in global options`, t => {
  const thisStub = getDefaultThisStub();
  const errorEntry = getCusomErrorEntry();
  thisStub.globalOptions.customErrors.set(STATUS_CODE, errorEntry);
  const selfMock = self.bind(thisStub);

  const result = selfMock(STATUS_CODE);

  t.equal(
    result,
    errorEntry,
    'should return custom error from global options'
  );

  t.end();
});

test(`${mn} > there is no custom error for this status code anywhere`, t => {
  const thisStub = getDefaultThisStub();
  const selfMock = self.bind(thisStub);

  const result = selfMock(STATUS_CODE);

  t.equal(
    result,
    null,
    'should return null'
  );

  t.end();
});
