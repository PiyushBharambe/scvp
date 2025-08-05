const knex = require('knex');
const { Model } = require('objection');

// Database configuration
const dbConfig = {
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: '../db/migrations',
  },
  seeds: {
    directory: '../db/seeds',
  },
};

// Initialize Knex
const knexInstance = knex(dbConfig);

// Bind Objection.js to Knex
Model.knex(knexInstance);

module.exports = knexInstance;