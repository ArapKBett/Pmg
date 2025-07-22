// server/src/controllers/credentialController.js
const { Credential } = require('../models');
const { encrypt, decrypt } = require('../utils/crypto');
const { wss } = require('../../server');

exports.getAllCredentials = async (req, res) => {
  try {
    const credentials = await Credential.findAll({ 
      where: { userId: req.user.userId }
    });
    
    const decrypted = credentials.map(cred => ({
      ...cred.dataValues,
      username: decrypt(cred.username, req.user.encryptionKey),
      password: decrypt(cred.password, req.user.encryptionKey),
      notes: cred.notes ? decrypt(cred.notes, req.user.encryptionKey) : null
    }));

    res.json(decrypted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCredential = async (req, res) => {
  try {
    const { service, username, password, notes, url, category } = req.body;
    
    const encrypted = {
      service,
      username: encrypt(username, req.user.encryptionKey),
      password: encrypt(password, req.user.encryptionKey),
      notes: notes ? encrypt(notes, req.user.encryptionKey) : null,
      url,
      category,
      userId: req.user.userId
    };

    const credential = await Credential.create(encrypted);
    
    // Broadcast to all connected clients
    wss.broadcast({
      type: 'CREDENTIAL_CREATED',
      data: {
        ...credential.dataValues,
        username,
        password,
        notes
      }
    });

    res.status(201).json({
      id: credential.id,
      service: credential.service
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCredential = async (req, res) => {
  try {
    const { id } = req.params;
    const { service, username, password, notes, url, category } = req.body;
    
    const credential = await Credential.findOne({
      where: { id, userId: req.user.userId }
    });
    
    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    const updates = {
      service,
      username: encrypt(username, req.user.encryptionKey),
      password: encrypt(password, req.user.encryptionKey),
      notes: notes ? encrypt(notes, req.user.encryptionKey) : null,
      url,
      category
    };

    await credential.update(updates);
    
    // Broadcast update
    wss.broadcast({
      type: 'CREDENTIAL_UPDATED',
      data: {
        ...credential.dataValues,
        username,
        password,
        notes
      }
    });

    res.json({
      id: credential.id,
      service: credential.service
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCredential = async (req, res) => {
  try {
    const { id } = req.params;
    
    const credential = await Credential.findOne({
      where: { id, userId: req.user.userId }
    });
    
    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    await credential.destroy();
    
    // Broadcast deletion
    wss.broadcast({
      type: 'CREDENTIAL_DELETED',
      data: { id }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
