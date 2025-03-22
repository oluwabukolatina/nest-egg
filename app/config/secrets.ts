import dotenv from 'dotenv';
import fs from 'fs';
import logger from '../lib/logger';

if (fs.existsSync('.env')) {
  logger.debug('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
}
function throwIfUndefined<T>(secret: T | undefined, name?: string): T {
  if (!secret) {
    logger.error(`${name} must not be undefined`);
    return process.exit(1);
  }
  return secret;
}
export const ENVIRONMENT = throwIfUndefined(process.env.NODE_ENV, 'NODE_ENV');
throwIfUndefined(process.env.DATABASE_HOST, 'DATABASE_HOST');
throwIfUndefined(process.env.DATABASE_PORT, 'DATABASE_PORT');
throwIfUndefined(process.env.DATABASE_NAME, 'DATABASE_NAME');
throwIfUndefined(process.env.DATABASE_USER, 'DATABASE_USER');
throwIfUndefined(process.env.DATABASE_PASSWORD, 'DATABASE_PASSWORD');
