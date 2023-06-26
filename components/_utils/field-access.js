import cookie from './cookie';
import { encryptToBase64, base64Decrypt } from './crypto';

export const AUTHORIZATION = 'Authorization';

export function setToken(token) {
  return cookie.set(encryptToBase64(AUTHORIZATION), encryptToBase64(token));
}

export function getToken() {
  let value = cookie.get(encryptToBase64(AUTHORIZATION));
  if(value) return base64Decrypt(value);
}

export function removeToken() {
  return cookie.remove(encryptToBase64(AUTHORIZATION));
}
