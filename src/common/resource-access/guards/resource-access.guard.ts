import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RESOURCE_ACCESS } from '../decorators/resource-access.decorator';
import { ResourceAccessOptions } from '../interfaces/resource-access-options.interface';
import { User, UserRole } from '../../../user/entities/user.entity';
import {
  ResourceAccessStrategyRegistry,
  STRATEGY_PROVIDERS_TOKEN,
} from '../interfaces/strategy-provider.interface';

/**
 * Guard for resource access control based on the user's role and path parameters.
 *
 * It allows:
 * - Admins to access any resource.
 * - Moderators to access resources that they are assigned to.
 *
 * This guard also uses strategies to determine access based on the resource type.
 */
@Injectable()
export class ResourceAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(STRATEGY_PROVIDERS_TOKEN)
    private strategyProviders: ResourceAccessStrategyRegistry,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User | undefined = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // First check method-level, then check class-level (convenient inheritance pattern)
    const options: ResourceAccessOptions =
      this.reflector.getAllAndOverride(RESOURCE_ACCESS, [
        context.getHandler(),
        context.getClass(),
      ]) ?? {};

    const {
      strategy,
      adminOnly = false,
      moderatorAccess = false,
      forbiddenMessage = 'You do not have permission to access this resource',
    } = options;

    const isAdmin = user.type === UserRole.ADMIN;
    const isModerator = user.type === UserRole.MODERATOR;
    const hasModeratorAccess = moderatorAccess && isModerator;

    // If admin, allow access
    if (isAdmin) {
      return true;
    }

    // If admin-only, only allow admins
    if (adminOnly && !isAdmin) {
      throw new ForbiddenException(forbiddenMessage);
    }

    // If moderator access is allowed and user is moderator, allow access
    if (hasModeratorAccess) {
      return true;
    }

    // If no strategy is provided, deny access
    if (!strategy) {
      throw new ForbiddenException(forbiddenMessage);
    }

    try {
      // Get strategy instance
      const strategyInstance = this.strategyProviders[strategy.providerToken];

      if (!strategyInstance) {
        throw new ForbiddenException('Invalid strategy provider');
      }

      console.log('strategyInstance', strategyInstance);

      // Use the strategy to determine access
      const hasAccess = await strategyInstance.canAccess(user, request.params);
      if (!hasAccess) {
        throw new ForbiddenException(strategyInstance.getForbiddenMessage());
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      throw new ForbiddenException(forbiddenMessage);
    }
  }
}
