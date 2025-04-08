import { Test, TestingModule } from '@nestjs/testing';
import { HttpAdapterHost } from '@nestjs/core';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ApiExceptionFilter } from '../filters/api-exception.filter';
import { ValidationException } from '../exceptions/validation.exception';
import { createMock } from '@golevelup/ts-jest';
import { ValidationError } from 'class-validator';

describe('ApiExceptionFilter', () => {
  let apiExceptionFilter: ApiExceptionFilter;
  let httpAdapterHost: HttpAdapterHost;
  let host: ArgumentsHost;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiExceptionFilter,
        {
          provide: HttpAdapterHost,
          useValue: createMock<HttpAdapterHost>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    apiExceptionFilter = module.get(ApiExceptionFilter);
    httpAdapterHost = module.get(HttpAdapterHost);
    host = createMock<ArgumentsHost>();
  });

  describe('catch', () => {
    it('should handle ValidationException correctly', () => {
      const exception = new ValidationException([
        {
          property: 'email',
          constraints: {
            isEmail: 'email must be a valid email',
          },
          value: 'invalid-email',
        } as ValidationError,
      ]);

      apiExceptionFilter.catch(exception, host);

      expect(httpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
        host.switchToHttp().getResponse(),
        {
          success: false,
          message: 'Validation failed',
          data: {
            code: 'VALIDATION_FAILED',
            errors: {
              email: {
                message: ['email must be a valid email'],
                constraints: ['isEmail'],
                value: 'invalid-email',
              },
            },
          },
          error: exception.stack,
        },
        HttpStatus.BAD_REQUEST,
      );
    });

    it('should handle HttpException with message and errors', () => {
      const errors = ['error1', 'error2'];
      const exception = new HttpException(
        {
          message: 'Custom error message',
          errors,
        },
        HttpStatus.BAD_REQUEST,
      );

      apiExceptionFilter.catch(exception, host);

      expect(httpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
        host.switchToHttp().getResponse(),
        {
          success: false,
          message: exception.message,
          data: { errors },
          error: exception.stack,
        },
        HttpStatus.BAD_REQUEST,
      );
    });

    it('should handle HttpException with only message', () => {
      const exception = new HttpException(
        'Simple error message',
        HttpStatus.NOT_FOUND,
      );

      apiExceptionFilter.catch(exception, host);

      expect(httpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
        host.switchToHttp().getResponse(),
        {
          success: false,
          message: exception.message,
          data: null,
          error: exception.stack,
        },
        HttpStatus.NOT_FOUND,
      );
    });

    it('should handle unknown exceptions', () => {
      const exception = new Error('Unknown error');

      apiExceptionFilter.catch(exception, host);

      expect(httpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
        host.switchToHttp().getResponse(),
        {
          success: false,
          message:
            'Something went wrong, please try again later. If the problem persists, please contact support.',
          data: null,
          error: exception.stack,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  });
});
