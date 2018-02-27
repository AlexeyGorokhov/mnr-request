# mnr-request

Opinionated wrapper around [request-promise-native](https://www.npmjs.com/package/request-promise-native)




## You may not need it!

This is a custom highly opinionated solution aimed at code reuse for a few private projects. You'd be better off using [request-promise-native](https://www.npmjs.com/package/request-promise-native) or [request-promise](https://www.npmjs.com/package/request-promise) directly.





## Installation

```bash
$ npm install mnr-request --save
```





## Usage example

```javascript
const mnrRequest = require('mnr-request');

const config = {
  apiNames: new Map([
    ['httpbin', 'https://httpbin.org'],
    ['example', 'http://example.com']
  ]),
  requestTimeoutMs: 15000,
  retries: 2,
  retryTimeoutMs: 2000,
  customErrors: new Map([
    [409, { name: 'ConflictError', message: 'request resulted in 409 Conflict response' }]
  ])
};

const request = mnrRequest(config);

const responseData = request({
  apiName: 'httpbin',
  path: '/get',
  method: 'GET',
  qs: {
    foo: 'bar'
  }
});
```




## Configuration

### apiNames

Type: `Map`

Collection of base URL aliases.


### requestTimeoutMs

Type: `Integer`

Timeout in milliseconds after which a single request attempt/retry fails. Optional. Defaults to 10000 ms.


### retries

Type: `Integer`

Number of retries. This number does not include the initial request. Optional.Defaults to 2. Retries happen in case of:
  * request fails due to a technical reason;
  * response status code >= 500 and no custom error is configured for such a status code.


### retryTimeoutMs

Type: `Integer`

Amount of time in milliseconds to wait before next retry. Optional. Defaults to 2000 ms.


### customErrors

Type: `Map`

Collection of custom error descriptors the promise has to reject with for defined response status codes. This overrides the default behavior of the module. Optional. Defaults to an empty collection.
  * @key `{Integer}` Response status code
  * @value `{Object}`
    * @prop `{String} name` Error name
    * @prop `{String} message` Error message




## API Reference

### request(options)

Type: `Function`

Makes an HTTP request.

#### options.apiName

Type: `String`

Alias to base URL.

#### options.path

Type: `String`

Relative endpoint path. May or may not start with '/'. Optional. Defaults to an empty string.

#### options.method

Type: `String`

HTTP method name. Optional. Defaults to 'GET'.

#### options.qs

Type: `Object`

Data to be sent in the query string. Optional.

#### options.body

Type: `Any`

Any JSON-serializable data to be sent in the request body. Optional.

#### Returns

Type: `Promise<Any>`

JSON-parsed response data.


#### Throws

The returned promise rejects with:

* A custom error passed configured with `config.customErrors`, or
* the following [VErrors](https://www.npmjs.com/package/verror):

##### NetworkError

Request failed due to a technical reason, or any of the tries has been aborted by timeout.

* `cause` - original error;
* `info` - request meta data.

##### ServiceUnavailable

Last try has received response with status code >=500.

* `info` - request meta data.

##### UnexpectedError

Response's status code >= 400 and <500, or something absolutely unexpected happened.

* `info` - request meta data.
