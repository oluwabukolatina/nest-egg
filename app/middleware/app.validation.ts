import { NextFunction, Request, Response } from 'express';
import { UnknownInterface } from '../lib/unknown.interface';
import { ClientError } from '../exception/client.error';

const AppValidation = {
  /**
   * joi validation
   * @param schema
   * @param request
   * @param response
   * @param next
   */
  async bodyBaseValidator(
    schema: UnknownInterface,
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      request.body = await schema.validateAsync(request.body);
      return next();
    } catch (error) {
      throw new ClientError(error.message.replace(/["]/gi, ''));
    }
  },
};
export default AppValidation;
