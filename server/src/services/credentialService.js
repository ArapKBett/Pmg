// server/src/services/credentialService.js
const { Credential } = require('../models');
const { encrypt, decrypt } = require('../utils/crypto');

class CredentialService {
  static async getUserCredentials(userId, encryptionKey) {
    const credentials = await Credential.findAll({ where: { userId } });
    return credentials.map(cred => this.decryptCredential(cred, encryptionKey));
  }

  static async createCredential(data, userId, encryptionKey) {
    const encryptedData = this.encryptCredential(data, encryptionKey);
    return Credential.create({ ...encryptedData, userId });
  }

  static async updateCredential(id, data, userId, encryptionKey) {
    const credential = await Credential.findOne({ where: { id, userId } });
    if (!credential) return null;

    const encryptedData = this.encryptCredential(data, encryptionKey);
    return credential.update(encryptedData);
  }

  static encryptCredential(data, encryptionKey) {
    return {
      service: data.service,
      username: encrypt(data.username, encryptionKey),
      password: encrypt(data.password, encryptionKey),
      notes: data.notes ? encrypt(data.notes, encryptionKey) : null,
      url: data.url,
      category: data.category
    };
  }

  static decryptCredential(credential, encryptionKey) {
    return {
      ...credential.dataValues,
      username: decrypt(credential.username, encryptionKey),
      password: decrypt(credential.password, encryptionKey),
      notes: credential.notes ? decrypt(credential.notes, encryptionKey) : null
    };
  }
}

module.exports = CredentialService;
