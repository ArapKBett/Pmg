// server/src/models/index.js
const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = dbConfig.use_env_variable
  ? new Sequelize(process.env[dbConfig.use_env_variable], dbConfig)
  : new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

module.exports = {
  sequelize,
  Sequelize,
  User: require('./user')(sequelize, Sequelize),
  Credential: require('./credential')(sequelize, Sequelize),
  OTP: require('./otp')(sequelize, Sequelize)
};
