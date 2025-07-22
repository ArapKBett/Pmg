// server/src/services/authService.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/server');
const { generateKey } = require('../utils/crypto');

class AuthService {
  static async registerUser({ username, email, masterPassword }) {
    const encryptionKey = generateKey();
    const masterPasswordHash = await bcrypt.hash(masterPassword, 12);
    const isFirstUser = (await User.count()) === 0;

    return User.create({
      username,
      email,
      masterPasswordHash,
      encryptionKey,
      isAdmin: isFirstUser
    });
  }

  static async validateUser(email, password) {
    const user = await User.scope('withSecrets').findOne({ where: { email } });
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.masterPasswordHash);
    return isValid ? user : null;
  }

  static generateToken(user) {
    return jwt.sign(
      { 
        userId: user.id, 
        isAdmin: user.isAdmin,
        encryptionKey: user.encryptionKey 
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    );
  }

  static verifyToken(token) {
    return jwt.verify(token, config.jwtSecret);
  }
}

module.exports = AuthService;
