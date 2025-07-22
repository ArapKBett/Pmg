// server/src/routes/credentials.js
const express = require('express');
const router = express.Router();
const credentialController = require('../controllers/credentialController');
const validator = require('../middleware/validator');

router.get('/', 
  validator.authenticate,
  credentialController.getAllCredentials
);

router.post('/', 
  validator.authenticate,
  validator.validate('createCredential'),
  credentialController.createCredential
);

router.put('/:id', 
  validator.authenticate,
  validator.validate('updateCredential'),
  credentialController.updateCredential
);

router.delete('/:id', 
  validator.authenticate,
  credentialController.deleteCredential
);

module.exports = router;
