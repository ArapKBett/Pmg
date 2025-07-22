// server/src/config/server.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  wsPort: process.env.WS_PORT || 3001,
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
  allowedOrigins: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000'],
  encryption: {
    algorithm: 'aes-256-cbc',
    ivLength: 16
  }
};
