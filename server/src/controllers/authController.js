// server/src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/server');
const { generateKey } = require('../utils/crypto');
const speakeasy = require('speakeasy');

exports.register = async (req, res) => {
  try {
    const { username, email, masterPassword } = req.body;
    
    // Generate encryption key from master password
    const encryptionKey = generateKey();
    const masterPasswordHash = await bcrypt.hash(masterPassword, 12);
    
    // First user becomes admin
    const isFirstUser = (await User.count()) === 0;
    
    const user = await User.create({
      username,
      email,
      masterPasswordHash,
      encryptionKey,
      isAdmin: isFirstUser
    });

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, masterPassword } = req.body;
    
    const user = await User.scope('withSecrets').findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(masterPassword, user.masterPasswordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        requires2FA: !!user.twoFactorSecret
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.setup2FA = async (req, res) => {
  try {
    const { userId } = req.user;
    
    const secret = speakeasy.generateSecret({
      name: `PasswordManager (${req.user.email})`
    });

    await User.update(
      { twoFactorSecret: secret.base32 },
      { where: { id: userId } }
    );

    res.json({
      secret: secret.base32,
      otpauthUrl: secret.otpauth_url
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verify2FA = async (req, res) => {
  try {
    const { userId, twoFactorSecret } = req.user;
    const { token } = req.body;

    const verified = speakeasy.totp.verify({
      secret: twoFactorSecret,
      encoding: 'base32',
      token
    });

    if (!verified) {
      return res.status(401).json({ error: 'Invalid 2FA token' });
    }

    // Generate new JWT with 2FA verified
    const newToken = jwt.sign(
      { userId, isAdmin: req.user.isAdmin, twoFactorVerified: true },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    );

    res.json({ token: newToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
