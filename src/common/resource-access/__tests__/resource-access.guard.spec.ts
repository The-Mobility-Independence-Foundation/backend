import { Test, TestingModule } from '@nestjs/testing';
import { ResourceAccessGuard } from '../guards/resource-access.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { User, UserRole } from '../../../user/entities/user.entity';
import { RESOURCE_ACCESS } from '../decorators/resource-access.decorator';
import {
  ResourceAccessStrategyToken,
  STRATEGY_PROVIDERS_TOKEN,
} from '../interfaces/strategy-provider.interface';
import { createMock } from '@golevelup/ts-jest';
import { when } from 'jest-when';
import { ResourceAccessStrategyRegistry } from '../interfaces/strategy-provider.interface';

describe('ResourceAccessGuard', () => {
  let guard: ResourceAccessGuard;
  let reflector: Reflector;
  let strategyProviders: ResourceAccessStrategyRegistry;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourceAccessGuard,
        {
          provide: STRATEGY_PROVIDERS_TOKEN,
          useValue: createMock<ResourceAccessStrategyRegistry>(),
        },
        {
          provide: Reflector,
          useValue: createMock<Reflector>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    guard = module.get<ResourceAccessGuard>(ResourceAccessGuard);
    reflector = module.get<Reflector>(Reflector);
    strategyProviders = module.get<ResourceAccessStrategyRegistry>(
      STRATEGY_PROVIDERS_TOKEN,
    );
  });

  describe('canActivate', () => {
    let context: ExecutionContext;
    let request: any;
    let user: User;

    beforeEach(() => {
      user = new User();
      request = {
        user,
        params: {},
      };

      context = createMock<ExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => request,
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
      });
    });

    it('should throw ForbiddenException when user is not authenticated', async () => {
      request.user = undefined;

      await expect(guard.canActivate(context)).rejects.toThrow(
        new ForbiddenException('User not authenticated'),
      );
    });

    it('should allow access if user is admin and route is admin-only', async () => {
      Object.assign(user, { type: UserRole.ADMIN });

      when(reflector.getAllAndOverride)
        .calledWith(RESOURCE_ACCESS, [context.getHandler(), context.getClass()])
        .mockReturnValue({ adminOnly: true });

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow access if user is admin and route is not admin-only', async () => {
      Object.assign(user, { type: UserRole.ADMIN });

      when(reflector.getAllAndOverride)
        .calledWith(RESOURCE_ACCESS, [context.getHandler(), context.getClass()])
        .mockReturnValue({});

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should deny access when user is not admin and route is admin-only', async () => {
      Object.assign(user, { type: UserRole.USER });

      when(reflector.getAllAndOverride)
        .calledWith(RESOURCE_ACCESS, [context.getHandler(), context.getClass()])
        .mockReturnValue({ adminOnly: true });

      await expect(guard.canActivate(context)).rejects.toThrow(
        new ForbiddenException(
          'You do not have permission to access this resource',
        ),
      );
    });

    it('should allow access when user is moderator and route allows moderator access', async () => {
      Object.assign(user, { type: UserRole.MODERATOR });

      when(reflector.getAllAndOverride)
        .calledWith(RESOURCE_ACCESS, [context.getHandler(), context.getClass()])
        .mockReturnValue({ moderatorAccess: true });

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should deny access when user is not moderator and route allows moderator access', async () => {
      Object.assign(user, { type: UserRole.USER });

      when(reflector.getAllAndOverride)
        .calledWith(RESOURCE_ACCESS, [context.getHandler(), context.getClass()])
        .mockReturnValue({ moderatorAccess: true });

      await expect(guard.canActivate(context)).rejects.toThrow(
        new ForbiddenException(
          'You do not have permission to access this resource',
        ),
      );
    });

    it('should deny access when no strategy is provided', async () => {
      Object.assign(user, { type: UserRole.USER });

      when(reflector.getAllAndOverride)
        .calledWith(RESOURCE_ACCESS, [context.getHandler(), context.getClass()])
        .mockReturnValue({});

      await expect(guard.canActivate(context)).rejects.toThrow(
        new ForbiddenException(
          'You do not have permission to access this resource',
        ),
      );
    });

    it('should allow access when strategy returns true', async () => {
      Object.assign(user, { type: UserRole.USER });
      request.params = { userId: '1' };

      const strategy = {
        canAccess: jest.fn().mockResolvedValue(true),
        getForbiddenMessage: jest.fn(),
      };

      when(reflector.getAllAndOverride)
        .calledWith(RESOURCE_ACCESS, [context.getHandler(), context.getClass()])
        .mockReturnValue({
          strategy: { providerToken: ResourceAccessStrategyToken.USER },
        });

      strategyProviders[ResourceAccessStrategyToken.USER] = strategy;

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(strategy.canAccess).toHaveBeenCalledWith(user, request.params);
    });

    it('should deny access when strategy returns false', async () => {
      Object.assign(user, { type: UserRole.USER });
      request.params = { userId: '1' };

      const strategy = {
        canAccess: jest.fn().mockResolvedValue(false),
        getForbiddenMessage: jest
          .fn()
          .mockReturnValue('Custom forbidden message'),
      };

      when(reflector.getAllAndOverride)
        .calledWith(RESOURCE_ACCESS, [context.getHandler(), context.getClass()])
        .mockReturnValue({
          strategy: { providerToken: ResourceAccessStrategyToken.USER },
        });

      strategyProviders[ResourceAccessStrategyToken.USER] = strategy;

      await expect(guard.canActivate(context)).rejects.toThrow(
        new ForbiddenException('Custom forbidden message'),
      );
      expect(strategy.canAccess).toHaveBeenCalledWith(user, request.params);
    });

    it('should throw ForbiddenException when strategy provider is invalid', async () => {
      Object.assign(user, { type: UserRole.USER });

      when(reflector.getAllAndOverride)
        .calledWith(RESOURCE_ACCESS, [context.getHandler(), context.getClass()])
        .mockReturnValue({
          strategy: { providerToken: 'INVALID_STRATEGY' },
        });

      strategyProviders['INVALID_STRATEGY' as ResourceAccessStrategyToken] =
        undefined;

      await expect(guard.canActivate(context)).rejects.toThrow(
        new ForbiddenException('Invalid strategy provider'),
      );
    });

    it('should use custom forbidden message when provided', async () => {
      Object.assign(user, { type: UserRole.USER });

      when(reflector.getAllAndOverride)
        .calledWith(RESOURCE_ACCESS, [context.getHandler(), context.getClass()])
        .mockReturnValue({
          forbiddenMessage: 'Custom error message',
        });

      await expect(guard.canActivate(context)).rejects.toThrow(
        new ForbiddenException('Custom error message'),
      );
    });

    it('should handle strategy throwing non-ForbiddenException error', async () => {
      Object.assign(user, { type: UserRole.USER });

      const strategy = {
        canAccess: jest.fn().mockRejectedValue(new Error('Unexpected error')),
        getForbiddenMessage: jest.fn(),
      };

      when(reflector.getAllAndOverride)
        .calledWith(RESOURCE_ACCESS, [context.getHandler(), context.getClass()])
        .mockReturnValue({
          strategy: { providerToken: ResourceAccessStrategyToken.USER },
        });

      strategyProviders[ResourceAccessStrategyToken.USER] = strategy;

      await expect(guard.canActivate(context)).rejects.toThrow(
        new ForbiddenException(
          'You do not have permission to access this resource',
        ),
      );
    });
  });
});
