import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { log } from '../config/logger.js';

export async function connectMongo(): Promise<void> {
  try {
    // console.log("Connecting to mongodbbbb");
    await mongoose.connect(env.mongoUri);
    log.info('Connected to MongoDB');
  } catch (err) {
    log.error('MongoDB connection error', err);
    throw err;
  }
}
