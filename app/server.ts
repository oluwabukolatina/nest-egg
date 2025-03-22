import app from './app';
import logger from './lib/logger';
import { database } from './database';

const { PORT } = process.env;
const server = app.listen(PORT, async () => {
  logger.info(`Server started at ${PORT}`);
  const connected = await database();
  if (!connected) {
    server.close(() => {
      logger.error('unable to connect to database');
      process.exit(1);
    });
  } else {
    logger.info('database connected');
  }
});
process.on('unhandledRejection', (err, promise) => {
  logger.info(err);
  logger.info(promise);
  server.close(() => process.exit(1));
});
