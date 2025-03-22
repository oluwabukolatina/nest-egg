import { Request, Response } from 'express';
import ResponseHandler from '../lib/response-handler';

function health(request: Request, response: Response) {
  return ResponseHandler.OkResponse(response, 'Server is running');
}

export default health;
