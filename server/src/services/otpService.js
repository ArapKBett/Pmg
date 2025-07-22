// server/src/services/otpService.js
const { OTP } = require('../models');
const speakeasy = require('speakeasy');
const { Op } = require('sequelize');

class OTPService {
  static async generateOTP(userId, service, type = 'totp', secret) {
    let code, expiresAt;
    
    if (type === 'totp') {
      code = speakeasy.totp({ secret, encoding: 'base32' });
      expiresAt = new Date(Date.now() + 30 * 1000);
    } else {
      code = Math.floor(100000 + Math.random() * 900000).toString();
      expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    }

    return OTP.create({ service, code, type, expiresAt, userId });
  }

  static async verifyOTP(userId, code) {
    const otp = await OTP.findOne({
      where: {
        userId,
        code,
        expiresAt: { [Op.gt]: new Date() }
      }
    });

    if (!otp) return false;
    
    await otp.destroy();
    return true;
  }

  static async cleanupExpiredOTPs() {
    return OTP.destroy({
      where: {
        expiresAt: { [Op.lt]: new Date() }
      }
    });
  }
}

module.exports = OTPService;
