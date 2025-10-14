// import { Redis } from '@upstash/redis';

// const redis = new Redis({
//   url: process.env.UPSTASH_REDIS_REST_URL!,
//   token: process.env.UPSTASH_REDIS_REST_TOKEN!,
// });

// export default redis;

import Redis from "ioredis";

// Check if REDIS_URL is defined
const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL environment variable is not defined");
}

// The ioredis client can parse the full connection string (REDIS_URL)
const redis = new Redis(redisUrl);

redis.on("error", (err) => console.log("Redis Client Error", err));

export default redis;
