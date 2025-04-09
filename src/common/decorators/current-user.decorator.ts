import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to get the current user from the request
 * @returns A decorator function
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
