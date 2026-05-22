const { redisClient } = require("../../config");

/**
 * Tries to fetch data from Redis. If missing or if Redis is down,
 * executes the fallback function (Postgres query) and caches the result.
 *
 * @param {string} key - The unique Redis cache key
 * @param {function} fallbackFn - The async Postgres database query
 * @param {number} ttl - Cache expiration time in seconds (default: 1 hour)
 */
async function getOrSetCache(key, fallbackFn, ttl = 3600) {
  // 1. Try to read from Redis
  if (redisClient.isOpen) {
    try {
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        console.log(`🚀 Cache Hit for key: ${key}`);
        return JSON.parse(cachedData);
      }
    } catch (redisError) {
      // Redis is broken or timed out — log it but don't break the user request
      console.warn(
        `⚠️ Redis read failed for key "${key}". Falling back to Postgres.`,
        redisError.message,
      );
    }
  } else {
    console.warn(`⚠️ Redis client is not open. Directing query to Postgres.`);
  }

  // 2. Fallback to Postgres if Redis failed or missed
  console.log(
    `🐢 Cache Miss / Fallback active for key: ${key}. Querying Postgres...`,
  );
  const freshData = await fallbackFn();

  // 3. Try to save back to Redis asynchronously for the next request
  if (redisClient.isOpen && freshData) {
    try {
      await redisClient.set(key, JSON.stringify(freshData), { EX: ttl });
    } catch (redisError) {
      console.warn(
        `⚠️ Failed to save key "${key}" to Redis cache:`,
        redisError.message,
      );
    }
  }

  return freshData;
}

module.exports = { getOrSetCache };
