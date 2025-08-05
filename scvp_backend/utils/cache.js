// utils/cache.js - Redis caching utility
const redis = require('redis');
const logger = require('./logger');

let client = null;

const connectRedis = async () => {
  if (!client) {
    client = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    client.on('error', (err) => {
      logger.error('Redis Client Error', { error: err.message });
    });

    client.on('connect', () => {
      logger.info('Connected to Redis');
    });

    await client.connect();
  }
  return client;
};

const getCache = async (key) => {
  try {
    const redisClient = await connectRedis();
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('Cache get error', { error: error.message });
    return null;
  }
};

const setCache = async (key, data, expireInSeconds = 300) => {
  try {
    const redisClient = await connectRedis();
    await redisClient.setEx(key, expireInSeconds, JSON.stringify(data));
    return true;
  } catch (error) {
    logger.error('Cache set error', { error: error.message });
    return false;
  }
};

const deleteCache = async (key) => {
  try {
    const redisClient = await connectRedis();
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error('Cache delete error', { error: error.message });
    return false;
  }
};

module.exports = {
  getCache,
  setCache,
  deleteCache
};