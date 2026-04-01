import redis from "./redis";

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number; // seconds
}

export const checkRateLimit = async (
  userId: string,
  action: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> => {
  const key = `ratelimit:${action}:${userId}`;

  const pipeline = redis.pipeline();
  pipeline.incr(key);
  pipeline.ttl(key);

  const results = await pipeline.exec();
  const count = (results?.[0]?.[1] as number) ?? 0;
  const ttl = (results?.[1]?.[1] as number) ?? 0;

  // Set expiry on first increment
  if (count === 1) {
    await redis.expire(key, windowSeconds);
  }

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    resetIn: ttl > 0 ? ttl : windowSeconds,
  };
};
