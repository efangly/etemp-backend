import { RedisClientType, createClient } from 'redis';
import dotenv from "dotenv";
dotenv.config();

let redisConn: RedisClientType;

const initRedis = async (): Promise<RedisClientType> => {
  redisConn = createClient({
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD
  });
  redisConn.on('error', error => console.log('Redis Client Error', error));
  await redisConn.connect();
  await redisConn.flushAll();
  return redisConn;
}

export {
  initRedis,
  redisConn
}