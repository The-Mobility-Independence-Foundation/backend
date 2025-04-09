import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiResponse } from '../responses/base-api.response';
import { Reflector } from '@nestjs/core';
import { RESPONSE_MESSAGE } from '../decorators/response-message.decorator';

/**
 * Interceptor that transforms the response to a BaseApiResponse
 * @param T - The type of the response data
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, BaseApiResponse<T>>
{
  constructor(private readonly reflector: Reflector) {}

  /**
   * Intercepts the response and transforms it to a BaseApiResponse
   * @param context - The execution context
   * @param next - The next handler in the chain
   * @returns The transformed response
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<BaseApiResponse<T>> {
    const message =
      this.reflector.get(RESPONSE_MESSAGE, context.getHandler()) ?? null;
    return next.handle().pipe(
      map((data) => ({
        success: true,
        message,
        data: data ?? null,
      })),
    );
  }
}
