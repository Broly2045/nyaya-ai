import Redis from "ioredis";

const getRedisClient = () => {
  const client = new Redis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    tls: process.env.REDIS_URL?.startsWith("rediss://") ? {} : undefined,
  });

  client.on("error", (err) => {
    console.error("Redis error:", err.message);
  });

  return client;
};

const globalForRedis = globalThis as unknown as { redis?: Redis };
const redis = globalForRedis.redis ?? getRedisClient();
if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

export default redis;
