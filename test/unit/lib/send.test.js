'use strict';

const test = require('tape');
const proxyquire = require('proxyquire').noPreserveCache();
const sinon = require('sinon');

const mn = 'lib/send';

const getSelf = (stubs = {}) => {
  const {
    bodyStub = Symbol(''),
    responseStub = {
      status: 200,
      json: () => Promise.resolve(bodyStub)
    },
    fetchStub = () => Promise.resolve(responseStub)
  } = stubs;

  return proxyquire('../../../lib/send', {
    'node-fetch': fetchStub
  });
};

const getThisStub = () => ({
  counter: 0,
  getCustomError: () => null,
  assertShouldRetry: () => false,
  makeRetry: sinon.spy(),
  getRequestInfo: () => ({}),
  getRetriesSetting: () => 0,
  resolve: sinon.spy(),
  reject: sinon.spy()
});

test(`${mn} > normal scenario`, async t => {
  try {
    const stubs = {
      bodyStub: Symbol('')
    };
    const thisStub = getThisStub();
    const selfMock = getSelf(stubs).bind(thisStub);

    await selfMock();

    t.equal(
      thisStub.resolve.calledWith(stubs.bodyStub),
      true,
      'should resolve with response body'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test(`${mn} > there is custom error for response status code`, async t => {
  try {
    const CUSTOM_ERROR = {
      name: 'error_name',
      message: 'error_msg'
    };
    const thisStub = {
      ...getThisStub(),
      getCustomError: () => CUSTOM_ERROR
    };
    const selfMock = getSelf().bind(thisStub);

    await selfMock();

    t.equal(
      thisStub.resolve.called,
      false,
      'should not resolve'
    );

    t.equal(
      thisStub.reject.called,
      true,
      'should reject'
    );

    const actualError = thisStub.reject.getCall(0).args[0];

    t.equal(
      actualError.name === CUSTOM_ERROR.name && actualError.message === CUSTOM_ERROR.message,
      true,
      'should reject with that custom error'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test(`${mn} > response status code is 5** and should retry`, async t => {
  try {
    const stubs = {
      responseStub: {
        status: 500,
        json: () => Promise.resolve()
      }
    };
    const thisStub = {
      ...getThisStub(),
      assertShouldRetry: () => true
    };
    const selfMock = getSelf(stubs).bind(thisStub);

    await selfMock();

    t.equal(
      thisStub.resolve.called,
      false,
      'should not resolve'
    );

    t.equal(
      thisStub.reject.called,
      false,
      'should not reject'
    );

    t.equal(
      thisStub.makeRetry.called,
      true,
      'should retry'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test(`${mn} > response status code is 5** and should not retry`, async t => {
  try {
    const stubs = {
      responseStub: {
        status: 500,
        json: () => Promise.resolve()
      }
    };
    const thisStub = {
      ...getThisStub(),
      assertShouldRetry: () => false
    };
    const selfMock = getSelf(stubs).bind(thisStub);

    await selfMock();

    t.equal(
      thisStub.resolve.called,
      false,
      'should not resolve'
    );

    t.equal(
      thisStub.makeRetry.called,
      false,
      'should not retry'
    );

    const error = thisStub.reject.getCall(0).args[0];

    t.equal(
      error.name,
      'ServiceUnavailable',
      'should reject with ServiceUnavailable error'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test(`${mn} > response status code is 4**`, async t => {
  try {
    const stubs = {
      responseStub: {
        status: 400,
        json: () => Promise.resolve()
      }
    };
    const thisStub = getThisStub();
    const selfMock = getSelf(stubs).bind(thisStub);

    await selfMock();

    t.equal(
      thisStub.resolve.called,
      false,
      'should not resolve'
    );

    t.equal(
      thisStub.makeRetry.called,
      false,
      'should not retry'
    );

    const error = thisStub.reject.getCall(0).args[0];

    t.equal(
      error.name,
      'UnexpectedError',
      'should reject with UnexpectedError error'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test(`${mn} > fetch throws and retries limit is not exceeded`, async t => {
  try {
    const stubs = {
      fetchStub: () => Promise.reject(new Error(''))
    };
    const thisStub = {
      ...getThisStub(),
      assertShouldRetry: () => true
    };
    const selfMock = getSelf(stubs).bind(thisStub);

    await selfMock();

    t.equal(
      thisStub.resolve.called,
      false,
      'should not resolve'
    );

    t.equal(
      thisStub.reject.called,
      false,
      'should not reject'
    );

    t.equal(
      thisStub.makeRetry.called,
      true,
      'should retry'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});

test(`${mn} > fetch throws and retries limit is exceeded`, async t => {
  try {
    const stubs = {
      fetchStub: () => Promise.reject(new Error(''))
    };
    const thisStub = {
      ...getThisStub(),
      assertShouldRetry: () => false
    };
    const selfMock = getSelf(stubs).bind(thisStub);

    await selfMock();

    t.equal(
      thisStub.resolve.called,
      false,
      'should not resolve'
    );

    t.equal(
      thisStub.makeRetry.called,
      false,
      'should not retry'
    );

    const error = thisStub.reject.getCall(0).args[0];

    t.equal(
      error.name,
      'NetworkError',
      'should reject with NetworkError error'
    );

    t.end();
  } catch (err) {
    t.end(err);
  }
});
