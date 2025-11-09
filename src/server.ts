import app from './app.js';
import { connectMongo } from './db/mongoose.js';
import { env } from './config/env.js';
import { log } from './config/logger.js';

async function main() {
  await connectMongo();
  app.listen(env.port, () => {
    log.info(`API listening on http://localhost:${env.port}`);
  });
  
}

main().catch((err) => {
  log.error('Server failed to start', err);
  process.exit(1);
});
