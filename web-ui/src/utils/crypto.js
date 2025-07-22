// web-ui/src/utils/crypto.js
import CryptoJS from 'crypto-js';

export function encrypt(text, key) {
  if (!text) return null;
  return CryptoJS.AES.encrypt(text, key).toString();
}

export function decrypt(ciphertext, key) {
  if (!ciphertext) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
}

export function generateKey() {
  return CryptoJS.lib.WordArray.random(32).toString();
}
