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

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let data = null;

    if (exception instanceof HttpException) {
      const response = exception.getResponse() as any;

      // Handle validation exceptions
      if (exception instanceof ValidationException) {
        message = 'Validation failed';
        data = {
          code: response.code,
          errors: response.errors,
        };
      } else {
        message = response.message || exception.message;
        // Include any additional error data
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

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
