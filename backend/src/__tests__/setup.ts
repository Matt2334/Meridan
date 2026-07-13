const dotenv  = require('dotenv');
dotenv.config({ path: '../../.env' });

jest.mock('../../prisma/library/redis', () => ({
  getCache: jest.fn().mockResolvedValue(null),
  setCache: jest.fn().mockResolvedValue(undefined),
  deleteCache: jest.fn().mockResolvedValue(undefined),
  deleteCachePattern: jest.fn().mockResolvedValue(undefined),
  connectRedis: jest.fn().mockResolvedValue(undefined),
}));