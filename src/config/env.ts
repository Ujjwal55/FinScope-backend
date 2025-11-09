import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || '4000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/finscope',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  marketCacheTtlSec: parseInt(process.env.MARKET_CACHE_TTL_SEC || '15', 10),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '60', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'production-key'
};
