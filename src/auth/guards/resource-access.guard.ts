import { ForbiddenException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RESOURCE_ACCESS } from '../decorators/resource-access.decorator';
import { ResourceAccessOptions } from '../interfaces/resource-access-options.interface';
import { User, UserRole } from '../../user/entities/user.entity';

@Injectable()
export class ResourceAccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: User | undefined = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Get options from decorator
    // First check method-level, then check class-level (convenient inheritance pattern)
    const options: ResourceAccessOptions =
      this.reflector.getAllAndOverride<ResourceAccessOptions>(RESOURCE_ACCESS, [
        context.getHandler(),
        context.getClass(),
      ]) || {};

    const {
      userIdParam = 'userId',
      adminOnly = false,
      moderatorAccess = false,
      forbiddenMessage = 'You do not have permission to access this resource',
    } = options;

    const isAdmin = user.type === UserRole.ADMIN;
    const isModerator = user.type === UserRole.MODERATOR;
    const hasModeratorAccess = moderatorAccess && isModerator;

    // If user is admin, allow access
    if (isAdmin) {
      return true;
    }

    // If admin-only and user is not admin, deny access
    if (adminOnly) {
      throw new ForbiddenException(forbiddenMessage);
    }

    // If moderator access is allowed and user is moderator, allow access
    if (hasModeratorAccess) {
      return true;
    }

    // At this point, they are regular users
    // So, check if they are accessing their own resource
    const resourceUserId = parseInt(request.params[userIdParam]);

    // If no user ID in params or it doesn't match the authenticated user, deny access
    if (isNaN(resourceUserId) || user.id !== resourceUserId) {
      throw new ForbiddenException(forbiddenMessage);
    }

    return true;
  }
}
