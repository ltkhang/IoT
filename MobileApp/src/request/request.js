import { Platform } from 'react-native';

const request = require('superagent');
const defaultAjaxTimeout = 30000;

request.Request.prototype.finish = function (callback) {
  this.end((err, res) => callback(err, res));
};

const requestWrapper = function (method) {
  return function (url) {
    if (Platform.OS === 'android') {
      // console.log('vo day khong', url);
      url = url.split('%').join('%25'); //Replace all % to %25
    }

    console.log(url);
    return request[method](url)
      .type('form')
      .timeout(defaultAjaxTimeout);
  };
};

export default {
  get: requestWrapper('get'),
  post: requestWrapper('post'),
  put: requestWrapper('put'),
  delete: requestWrapper('delete')
};