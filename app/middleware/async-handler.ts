import { NextFunction, Response, Request } from 'express';

export const asyncHandler =
  (fn: (request: Request, response: Response, next: NextFunction) => void) =>
  (request: Request, response: Response, next: NextFunction) => {
    return Promise.resolve(fn(request, response, next)).catch(next);
  };
