const knex = require('knex');
require('dotenv').config();

// Helper function to parse DATABASE_URL and add SSL settings
function getConnectionConfig() {
  if (process.env.DATABASE_URL) {
    // For DATABASE_URL, we need to add SSL settings
    return {
      connection: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    };
  }
  
  // Fallback to individual environment variables
  return {
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false }
    }
  };
}

const config = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'around_me_now_dev'
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    },
    pool: {
      min: 2,
      max: 10
    }
  },
  test: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'around_me_now_test'
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    },
    pool: {
      min: 1,
      max: 5
    }
  },
  production: {
    client: 'postgresql',
    ...getConnectionConfig(),
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    },
    pool: {
      min: 2,
      max: 20
    }
  }
};

const environment = process.env.NODE_ENV || 'development';
const db = knex(config[environment]);

// Test database connection
db.raw('SELECT 1')
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  });

module.exports = db; 