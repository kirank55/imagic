// import { Redis } from '@upstash/redis';

// const redis = new Redis({
//   url: process.env.UPSTASH_REDIS_REST_URL!,
//   token: process.env.UPSTASH_REDIS_REST_TOKEN!,
// });
 
// export default redis;

import Redis from 'ioredis';

// The ioredis client can parse the full connection string (REDIS_URL)
const redis = new Redis(process.env.REDIS_URL); 

redis.on("error", (err) => console.log("Redis Client Error", err));

export default redis;