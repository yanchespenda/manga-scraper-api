const catchCloudflare = require('@ctrl/cloudflare')
const got = require('got')
const { CookieJar } = require('tough-cookie')
const uaString = require('ua-string')
const errors = require('./errors')
 
// example helper function
async function instance(url) {
  // cookie jar required
  const cookieJar = new CookieJar();
  const options = {
    cookieJar,
    headers: {
      // helps to pass user-agent
      'user-agent': uaString,
    }, 
    retry: {
      // either disable retry or remove status code 503 from retries
      // retries: 0,
      statusCodes: [408, 413, 429, 500, 502, 504],
    },
    hooks: {
      beforeError: [
        err => {
          console.error(err)
          const { response } = err;
  
          if (err instanceof got.HTTPError) {
            if (err.statusCode === 404) {
              return {
                name: 'Not Found',
                statusCode: 404,
                code: 'HTTP_ERROR',
              }
              // return new errors.NotFoundError(err.url);
            }
            return {
              name: err.statusMessage,
              statusCode: err.statusCode,
              code: 'HTTP_ERROR',
            }
            // return new errors.HTTPError(err.statusCode, err.statusMessage, err.url);
          } else if (err instanceof got.RequestError) {
            if (err.code === 'ETIMEDOUT') {
              return {
                name: err.message,
                code: `TIMEOUT`,
              }
              // return new errors.TimeoutError(err.message, err.url);
            }
            return {
              name: `Failed to make a request to '${err.url}'`,
              code: `REQUEST_ERROR`,
            }
            // return new errors.RequestError(err.url);
          }
          if (err.code === 'ERR_SSL_DECRYPTION_FAILED_OR_BAD_RECORD_MAC') {
            return {
              name: `Failed to make a request to '${err.url}'`,
              code: `REQUEST_ERROR`,
            }
          }
          return {
            name: err.message,
            code: `ERROR`,
          }
          // return new errors.MangaError('ERROR', err.message);
        },
      ],
    },
    mutableDefaults: true,
    timeout: 5 * 1000
  };
 
  let res;
  try {
    // success without cloudflare?
    res = await got(url, options);
    // console.info("got", res)
  } catch (error) {
    // success with cloudflare?
    res = await catchCloudflare(error, options);
    // console.info("cloudflare", res)
  }
  return res;
}

module.exports = instance