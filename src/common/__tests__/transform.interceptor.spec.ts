import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { RESPONSE_MESSAGE } from '../decorators/response-message.decorator';
import { createMock } from '@golevelup/ts-jest';
import { of } from 'rxjs';
import { when } from 'jest-when';
import { firstValueFrom } from 'rxjs';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<any>;
  let reflector: Reflector;
  let executionContext: ExecutionContext;
  let callHandler: CallHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransformInterceptor,
        {
          provide: Reflector,
          useValue: createMock<Reflector>(),
        },
      ],
    }).compile();

    interceptor = module.get(TransformInterceptor);
    reflector = module.get(Reflector);

    executionContext = createMock<ExecutionContext>();
    callHandler = createMock<CallHandler>();
  });

  describe('intercept', () => {
    it('should transform response with data and message', async () => {
      const data = { id: 1, name: 'Test User' };
      const message = 'Operation successful';

      when(reflector.get)
        .calledWith(RESPONSE_MESSAGE, executionContext.getHandler())
        .mockReturnValue(message);

      when(callHandler.handle).calledWith().mockReturnValue(of(data));

      const result = await firstValueFrom(
        interceptor.intercept(executionContext, callHandler),
      );

      expect(result).toEqual({
        success: true,
        message,
        data,
      });
      expect(reflector.get).toHaveBeenCalledWith(
        RESPONSE_MESSAGE,
        executionContext.getHandler(),
      );
      expect(callHandler.handle).toHaveBeenCalled();
    });

    it('should transform response with null message when no message is provided', async () => {
      const data = { id: 1, name: 'Test User' };

      when(reflector.get)
        .calledWith(RESPONSE_MESSAGE, executionContext.getHandler())
        .mockReturnValue(null);

      when(callHandler.handle).calledWith().mockReturnValue(of(data));

      const result = await firstValueFrom(
        interceptor.intercept(executionContext, callHandler),
      );

      expect(result).toEqual({
        success: true,
        message: null,
        data,
      });
      expect(reflector.get).toHaveBeenCalledWith(
        RESPONSE_MESSAGE,
        executionContext.getHandler(),
      );
    });

    it('should transform response with null/undefined data when no data is returned', async () => {
      const message = 'Operation successful';

      when(reflector.get)
        .calledWith(RESPONSE_MESSAGE, executionContext.getHandler())
        .mockReturnValue(message);

      when(callHandler.handle).calledWith().mockReturnValue(of(null));

      const result = await firstValueFrom(
        interceptor.intercept(executionContext, callHandler),
      );

      expect(result).toEqual({
        success: true,
        message,
        data: null,
      });
    });
  });
});
