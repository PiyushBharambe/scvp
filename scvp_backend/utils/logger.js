// utils/logger.js - Winston logging utility
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  defaultMeta: { service: 'scvp-backend' },
  transports: [
    new winston.transports.Console()
  ],
});



module.exports = logger;