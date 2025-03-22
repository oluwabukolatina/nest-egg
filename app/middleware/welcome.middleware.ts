import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ResponseHandler from '../lib/response-handler';

function welcomeMessage(request: Request, response: Response) {
  return ResponseHandler.SuccessResponse(
    response,
    StatusCodes.OK,
    'Welcome to Nest Egg',
  );
}

export default welcomeMessage;
