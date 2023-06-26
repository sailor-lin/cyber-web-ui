import CryptoJS from "crypto-js";

/**
* @function encryptToBase64 base64加密方法
* @param {String} str 明文字符串
* @returns {String}
*/
export const encryptToBase64 = (str) => {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str));
}

/**
* @function base64Decrypt base64解密方法
* @param {String} str 加密字符串
* @returns {String}
*/
export function base64Decrypt(str) {
  return CryptoJS.enc.Base64.parse(str).toString(CryptoJS.enc.Utf8);
}

/**
 * @function encryption 密码加密
 * @param {{ data: Object, param: String[], key: String }} params data：表单数据  param：要加密的key  key：加密key
 * @returns {Object}
 */
export function encryption(params) {
	let { data, param, key } = params;
	const result = JSON.parse(JSON.stringify(data));
  key = CryptoJS.enc.Latin1.parse(key);
  
  param.forEach((ele) => {
    let data = result[ele];
    // 加密
    let encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: key,
      mode: CryptoJS.mode.CFB,
      padding: CryptoJS.pad.NoPadding,
    });
    result[ele] = encrypted.toString();
  });
	return result;
}


/**
 * @function generateRandomCode 生成随机码
 * @description 随机生成包含小写字母和数字的随机码
 * @param {Number} number 生成随机码的个数，默认为 10
 * @returns {String}
 */
export function generateRandomCode(number = 10) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charCount = chars.length;
  let randomString1 = '';
  for (let i = 0; i < number; i++) {
    const randomIndex = Math.floor(Math.random() * charCount);
    randomString1 += chars[randomIndex];
  }
  return randomString1
}
