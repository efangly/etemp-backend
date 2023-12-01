import { RedisClientType, createClient } from 'redis';

let redisConn: RedisClientType;

const initRedis = async (): Promise<RedisClientType> => {
  redisConn = createClient();
  redisConn.on('error', err => console.log('Redis Client Error', err));
  await redisConn.connect();
  return redisConn;
}

export {
  initRedis,
  redisConn
}