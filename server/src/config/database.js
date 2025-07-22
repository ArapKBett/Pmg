// src/config/database.js
require('dotenv').config();

function parseDatabaseUrl() {
  if (!process.env.DATABASE_URL) return null;
  
  try {
    const url = new URL(process.env.DATABASE_URL);
    return {
      username: url.username,
      password: url.password,
      host: url.hostname,
      port: url.port,
      database: url.pathname.slice(1)
    };
  } catch (err) {
    console.error('Error parsing DATABASE_URL:', err);
    return null;
  }
}

const dbConfig = parseDatabaseUrl() || {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
};

module.exports = {
  development: {
    ...dbConfig,
    dialect: 'postgres',
    logging: console.log
  },
  test: {
    ...dbConfig,
    database: `${dbConfig.database}_test`,
    dialect: 'postgres'
  },
  production: {
    ...dbConfig,
    dialect: 'postgres',
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
