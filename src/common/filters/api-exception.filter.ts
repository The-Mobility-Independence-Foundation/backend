import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { BaseApiResponse } from '../responses/base-api.response';
import { ValidationException } from '../exceptions/validation.exception';

/**
 * Exception filter for handling API exceptions
 */
@Catch()
export class ApiExceptionFilter implements ExceptionFilter<Error> {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  /**
   * Catch an exception and transform it into a BaseApiResponse
   * @param exception - The exception to catch
   * @param host - The host arguments
   */
  catch(exception: Error, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      'Something went wrong, please try again later. If the problem persists, please contact support.';
    let data = null;

    if (exception instanceof HttpException) {
      const response = exception.getResponse() as any;

      if (exception instanceof ValidationException) {
        message = 'Validation failed';
        data = response;
      } else {
        message = response.message || exception.message;
        if (response.errors) {
          data = { errors: response.errors };
        }
      }
    }

    const responseBody: BaseApiResponse = {
      success: false,
      message,
      data,
    };

    const ctx = host.switchToHttp();
    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
