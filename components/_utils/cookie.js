// https://www.npmjs.com/package/vue-cookies
import cookie from 'vue-cookies';

cookie.config('365d');

// cookie.get(keyName)
// cookie.set(keyName, value[, expires[, path[, domain[, secure[, sameSite]]]]])
// cookie.remove(keyName [, path [, domain]])
// cookie.isKey(keyName)
// cookie.keys()

/**
 * @function 清空cookie
 * @param {String} ...args 不清空的cookie
 */
cookie.clear = (...args) => {
  let list = cookie.keys();
  list.forEach(keyName => {
    if(!args.some(item => item == keyName)) {
      cookie.remove(keyName);
    }
  });
}

export default cookie;
