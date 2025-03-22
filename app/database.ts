import db from './models';
import logger from './lib/logger';

export const database = async () => {
  try {
    await db.sequelize.authenticate();
    logger.info('Database connection established successfully');
    return true;
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    return false;
  }
};
