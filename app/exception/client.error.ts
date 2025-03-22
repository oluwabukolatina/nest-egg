import { StatusCodes } from 'http-status-codes';
import CustomError from './custom.error';
import { UnknownInterface } from '../lib/unknown.interface';

export class ClientError extends CustomError {
  constructor(message: string, error?: UnknownInterface) {
    super(StatusCodes.BAD_REQUEST, message, error);
  }
}
