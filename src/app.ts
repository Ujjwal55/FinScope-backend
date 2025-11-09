import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import holdingsRouter from './routes/holdings.js';
import marketDataRouter from './routes/marketData.js';
import stockInfoRouter from './routes/stockInfo.js';

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

const limiter = rateLimit({ windowMs: env.rateLimitWindowMs, max: env.rateLimitMax });
app.use(limiter);

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/holdings', holdingsRouter);
app.use('/api/market-data', marketDataRouter);
app.use('/api/stock-info', stockInfoRouter);

export default app;
