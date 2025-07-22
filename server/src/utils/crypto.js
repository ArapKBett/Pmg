// server/src/utils/crypto.js
const crypto = require('crypto');
const config = require('../config/server').encryption;

function encrypt(text, key) {
  if (!text) return null;
  
  const iv = crypto.randomBytes(config.ivLength);
  const cipher = crypto.createCipheriv(
    config.algorithm, 
    Buffer.from(key, 'hex'), 
    iv
  );
  
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

function decrypt(text, key) {
  if (!text) return null;
  
  try {
    const [ivHex, encryptedHex] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    
    const decipher = crypto.createDecipheriv(
      config.algorithm, 
      Buffer.from(key, 'hex'), 
      iv
    );
    
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString();
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

function generateKey() {
  return crypto.randomBytes(32).toString('hex');
}

module.exports = { encrypt, decrypt, generateKey };
