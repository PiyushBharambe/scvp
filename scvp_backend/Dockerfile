# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
# to install dependencies first
COPY package*.json ./

# Install app dependencies
RUN npm install --production

# Copy the rest of the application source code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Add a wait script to ensure the database is ready
# This script will continuously check the database connection
# It uses 'db' as the hostname because that's the service name in docker-compose
# and it will resolve to the IP address of the db container.
# It uses the DB_USER, DB_PASSWORD, DB_NAME, DB_PORT from its environment
# which are passed from docker-compose.yml
COPY wait-for-db.sh /usr/src/app/wait-for-db.sh
RUN chmod +x /usr/src/app/wait-for-db.sh

# Modify the CMD to first wait for the database, then run the application
CMD ["/usr/src/app/wait-for-db.sh", "npm", "start"]
