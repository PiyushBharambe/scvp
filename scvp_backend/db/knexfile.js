// db/knexfile.js
require("dotenv").config(); // Load environment variables from .env file

module.exports = {
  development: {
    client: "pg",
    // Connection string is now read directly from process.env.DATABASE_URL
    // This variable will be set by Docker Compose from your root .env file
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./seeds",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./seeds",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};
