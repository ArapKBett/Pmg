// server/src/routes/sync.js
const express = require('express');
const router = express.Router();
const syncController = require('../controllers/syncController');
const validator = require('../middleware/validator');

router.get('/', 
  validator.authenticate,
  syncController.syncAllData
);

router.ws('/ws', 
  validator.authenticateWS,
  syncController.handleWebSocket
);

module.exports = router;
