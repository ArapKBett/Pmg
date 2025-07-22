// server/src/config/database.js
require('dotenv').config();

const parseDbUrl = require('parse-database-url');

// Function to extract connection parameters from DATABASE_URL
function getConfig() {
  if (process.env.DATABASE_URL) {
    const config = parseDbUrl(process.env.DATABASE_URL);
    return {
      username: config.user,
      password: config.password,
      database: config.database,
      host: config.host,
      port: config.port,
      dialect: 'postgres',
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      }
    };
  }

  return {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres'
  };
}

module.exports = {
  development: {
    ...getConfig(),
    logging: console.log
  },
  test: {
    ...getConfig(),
    database: `${process.env.DB_NAME}_test` || `${getConfig().database}_test`,
    logging: false
  },
  production: {
    ...getConfig(),
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
