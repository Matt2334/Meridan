import { createClient, RedisClientType } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL,
  ...(process.env.REDIS_URL.startsWith('rediss://') && {
    socket: {
    tls: true,
    rejectUnauthorized: false
  }})
});

client.on('error', (err) => console.error('Redis error:', err));

export const connectRedis = async () => {
  if (!client.isOpen) await client.connect();
};

export const getCache = async <T>(key:string): Promise<T | null> =>{
  const data = await client.get(key) as string | null;
  return data ? JSON.parse(data) as T : null;
}

export const setCache = async <T>(
  key: string,
  value: T,
  ttlSeconds: number = 300 // 5 minutes default
): Promise<void> => {
  await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
};

export const deleteCache = async (key: string): Promise<void> => {
  await client.del(key);
};
export const deleteCachePattern = async (pattern: string): Promise<void> => {
  const keys = await client.keys(pattern);
  if (keys.length > 0) {
    await client.del(keys);
  }
};
export default client;