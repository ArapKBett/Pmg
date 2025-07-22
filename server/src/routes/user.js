// server/src/routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validator = require('../middleware/validator');

router.get('/me', 
  validator.authenticate,
  userController.getCurrentUser
);

router.put('/password', 
  validator.authenticate,
  validator.validate('changePassword'),
  userController.changePassword
);

router.delete('/account', 
  validator.authenticate,
  userController.deleteAccount
);

module.exports = router;
