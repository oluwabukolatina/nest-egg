import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UnknownInterface } from './unknown.interface';
import SharedHelper from './shared.helper';
import CustomError from '../exception/custom.error';

class ResponseHandler {
  static OkResponse(response: Response, message = '', data?: UnknownInterface) {
    return response
      .status(StatusCodes.OK)
      .json({ status: true, message: SharedHelper.titleCase(message), data });
  }

  static HttpExceptionResponse(
    next: NextFunction,
    code: number,
    message: string,
    data?: UnknownInterface,
  ) {
    // return next(new CustomError(code, SharedHelper.titleCase(message), data));
    throw new CustomError(code, SharedHelper.titleCase(message), data);
  }

  static ErrorResponse(
    response: Response,
    code: number,
    message: string,
    data?: UnknownInterface,
  ) {
    return response
      .status(code)
      .json({ message: SharedHelper.titleCase(message), status: false, data });
  }

  static JoiErrorResponse(
    response: Response,
    code: number,
    data: UnknownInterface,
    message: string,
  ) {
    return response.status(code).json({ status: false, message, data });
  }

  static SuccessResponse(
    response: Response,
    code: number,
    message = '',
    data?: UnknownInterface,
  ) {
    return response
      .status(code)
      .json({ status: true, message: SharedHelper.titleCase(message), data });
  }

  static CreatedResponse(
    response: Response,
    message = '',
    data?: UnknownInterface,
  ) {
    return response
      .status(StatusCodes.CREATED)
      .json({ message: SharedHelper.titleCase(message), status: true, data });
  }

  static ServerErrorResponse(
    response: Response,
    code?: number | UnknownInterface,
    message?: string,
    error?: UnknownInterface,
    data?: UnknownInterface,
  ) {
    if (error) {
      return response.status(code).json({
        message: SharedHelper.titleCase(`server message: -${message}`),
        status: false,
        data,
        error,
      });
    }
    return response.status(code).json({
      message: SharedHelper.titleCase(`server message: -${message}`),
      status: false,
      data,
    });
  }

  static BadRequestResponse(
    response: Response,
    message: string,
    data?: UnknownInterface,
  ) {
    if (data) {
      return response.status(StatusCodes.BAD_REQUEST).json({
        message: SharedHelper.titleCase(message),
        status: false,
        data,
      });
    }
    return response.status(StatusCodes.BAD_REQUEST).json({
      message: SharedHelper.titleCase(message),
      status: false,
    });
  }

  static ForbiddenRequestResponse(
    response: Response,
    message: string,
    data?: UnknownInterface,
  ) {
    if (data) {
      return response.status(StatusCodes.BAD_REQUEST).json({
        message: SharedHelper.titleCase(message),
        status: false,
        data,
      });
    }
    return response.status(StatusCodes.BAD_REQUEST).json({
      message: SharedHelper.titleCase(message),
      status: false,
    });
  }

  static UnAuthorizedResponse(
    response: Response,
    message: string,
    data?: UnknownInterface,
  ) {
    if (data) {
      return response.status(StatusCodes.UNAUTHORIZED).json({
        message: SharedHelper.titleCase(message),
        status: false,
        data,
      });
    }
    return response.status(StatusCodes.UNAUTHORIZED).json({
      message: SharedHelper.titleCase(message),
      status: false,
    });
  }

  static NotFoundResponse(response: Response, message: string) {
    return response
      .status(StatusCodes.NOT_FOUND)
      .json({ status: false, message: SharedHelper.titleCase(message) });
  }
}
export default ResponseHandler;
