# mnr-request

Opinionated wrapper around [node-fetch](https://www.npmjs.com/package/node-fetch)




## You may not need it!

This is a custom, highly opinionated solution aimed at code re-use for a few private projects. You'd be better off using [node-fetch](https://www.npmjs.com/package/node-fetch) directly.




## Version 2 Breaking Changes

* This is a complete re-write using [node-fetch](https://www.npmjs.com/package/node-fetch) instead of [request-promise-native](https://www.npmjs.com/package/request-promise-native) under the hood.

* Module initialization API is incompatible with v1. Though, request API is incompatible.

Archive documentation: [v1](https://github.com/AlexeyGorokhov/mnr-request/blob/master/docs_archives/README-v1.md).




## Installation

```bash
$ npm install mnr-request --save
```





## Usage Examples

```javascript
const mnrRequest = require('mnr-request');

const apis = new Map([
  ['httpbin', {
    baseUrl: 'https://httpbin.org',
    apiOptions: {
      requestTimeoutMs: 5000,
      retries: 5,
      retryTimeoutMs: 500,
      customErrors: new Map([
        [401, { name: 'UnauthorizedError', message: 'request unauthorized' }]
      ])
    }
  }],
  ['example', { baseUrl: 'http://example.com' }]
]);

const globalOptions = {
  requestTimeoutMs: 10000,
  retries: 1,
  retryTimeoutMs: 3000,
  customErrors: new Map([
    [409, { name: 'ConflictError', message: 'request resulted in 409 Conflict response' }]
  ])
};


const request = mnrRequest(apis, globalOptions);

const responseData1 = request({
  apiName: 'httpbin',
  path: '/get',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer 123foo='
  },
  qs: {
    foo: 'bar'
  }
});

const responseData2 = request({
  apiName: 'example',
  path: '/',
  method: 'PUT',
  body: {
    foo: 'bar'
  },
  requestOptions: {
    requestTimeoutMs: 0,
    retries: 0,
    retryTimeoutMs: 0,
    customErrors: new Map([
      [500, { name: 'CriticalError', message: 'backend is broken' }]
    ])
  }
});
```



## API Reference

`mnrRequest(apis, globalOptions)` - see JSDoc comments in `./index.js` file.

`request(opts)` - see JSDoc comments in `./lib/request.js` file.
