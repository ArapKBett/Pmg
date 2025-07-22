// server/src/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validator = require('../middleware/validator');
const rateLimit = require('express-rate-limit');

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many login attempts'
});

router.post('/register', 
  validator.validate('register'),
  authController.register
);

router.post('/login', 
  authLimiter,
  validator.validate('login'),
  authController.login
);

router.post('/2fa/setup', 
  validator.authenticate,
  authController.setup2FA
);

router.post('/2fa/verify', 
  validator.authenticate,
  validator.validate('verify2FA'),
  authController.verify2FA
);

module.exports = router;
