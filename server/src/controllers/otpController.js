// server/src/controllers/otpController.js
const { OTP } = require('../models');
const { wss } = require('../../server');
const speakeasy = require('speakeasy');

exports.generateOTP = async (req, res) => {
  try {
    const { service, type = 'totp' } = req.body;
    
    let code, expiresAt;
    
    if (type === 'totp') {
      code = speakeasy.totp({
        secret: req.user.twoFactorSecret,
        encoding: 'base32'
      });
      expiresAt = new Date(Date.now() + 30 * 1000); // 30 seconds
    } else {
      code = Math.floor(100000 + Math.random() * 900000).toString();
      expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    }

    const otp = await OTP.create({
      service,
      code,
      type,
      expiresAt,
      userId: req.user.userId
    });

    // Broadcast new OTP
    wss.broadcast({
      type: 'OTP_GENERATED',
      data: otp
    });

    res.json(otp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOTPs = async (req, res) => {
  try {
    const otps = await OTP.findAll({
      where: { userId: req.user.userId },
      order: [['expiresAt', 'DESC']]
    });
    
    res.json(otps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { code } = req.body;
    
    const otp = await OTP.findOne({
      where: {
        code,
        userId: req.user.userId,
        expiresAt: { [Op.gt]: new Date() }
      }
    });
    
    if (!otp) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Delete the OTP after verification
    await otp.destroy();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
