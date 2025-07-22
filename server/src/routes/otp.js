// server/src/routes/otp.js
const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');
const validator = require('../middleware/validator');

router.get('/', 
  validator.authenticate,
  otpController.getOTPs
);

router.post('/generate', 
  validator.authenticate,
  validator.validate('generateOTP'),
  otpController.generateOTP
);

router.post('/verify', 
  validator.authenticate,
  validator.validate('verifyOTP'),
  otpController.verifyOTP
);

module.exports = router;
