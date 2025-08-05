#!/bin/sh
echo "Waiting for database..."
sleep 10
echo "Running migrations..."
npx knex migrate:latest --knexfile db/knexfile.js
echo "Running seeds..."
npx knex seed:run --knexfile db/knexfile.js
echo "Starting server..."
npm start