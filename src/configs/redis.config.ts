import { RedisClientType, createClient } from 'redis';

let redisConn: RedisClientType;

const initRedis = async (): Promise<RedisClientType> => {
  redisConn = createClient({
    url: 'redis://thanespgm.com:6378'
  });
  redisConn.on('error', err => console.log('Redis Client Error', err));
  await redisConn.connect();
  return redisConn;
}

export {
  initRedis,
  redisConn
}