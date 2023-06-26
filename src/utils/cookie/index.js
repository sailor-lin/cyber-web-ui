import cookie from 'vue-cookie'
class Cookie {
  instance

  constructor() {
    this.instance = cookie
  }

  set(keyName, value, expires = '24h') {
    expires = expires == 'all' ? '100Y' : expires
    this.instance.set(keyName, value, {
      expires: expires
    })
  }
  get(keyName) {
    return this.instance.get(keyName)
  }
  isKey(keyName) {
    return this.instance.isKey(keyName)
  }
  delete(keyName) {
    this.instance.delete(keyName)
  }
  /**
   * @function 清空cookie
   * @param {string | array} exclude 不删除的cookie
   */
  clear(exclude = "") {
    let cookieList = document.cookie && document.cookie.split(';') || []
    cookieList.forEach(item => {
      let arr = item.trim().split('=')
      let cookieKey = arr[0] || ''
      let flag = Array.isArray(exclude) ? exclude.some(key => key == cookieKey) : exclude == cookieKey
      if(!flag) {
        cookieKey && this.delete(cookieKey)
      }
    })
  }
}

export default new Cookie