import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../exception/custom.error';

async function notFoundMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  return next(
    new CustomError(
      StatusCodes.NOT_FOUND,
      `${request.originalUrl} does not exist`,
    ),
  );
}

export default notFoundMiddleware;
