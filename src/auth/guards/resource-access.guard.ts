import { ForbiddenException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RESOURCE_ACCESS } from '../decorators/resource-access.decorator';
import { ResourceAccessOptions } from '../interfaces/resource-access-options.interface';
import { User, UserRole } from '../../user/entities/user.entity';

/**
 * Guard for resource access control based on the user's role and path parameters.
 *
 * It allows:
 * - Admins to access any resource.
 * - Moderators to access resources that they are assigned to.
 * - Regular users to access their own resources.
 *
 * This guard will also check if the user is accessing their own resource by comparing the userId (or other param) in the path
 * parameters with the userId in the request user object.
 */
@Injectable()
export class ResourceAccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
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

    // TODO: Maybe we can extend this to support other resource types (ex: 'postId', 'commentId', ...)
    // We allow the options to be overridden for each endpoint, but specify default values here
    const {
      adminOnly = false,
      moderatorAccess = false,
      userIdParam = 'userId',
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

    // TODO: What if no userIdParam is provided?

    // At this point, they are regular users, so we check if they are accessing their own resource
    const resourceUserId = parseInt(request.params[userIdParam]);

    // If no user id in params or it doesn't match the authenticated user, deny access
    if (isNaN(resourceUserId) || user.id !== resourceUserId) {
      throw new ForbiddenException(forbiddenMessage);
    }

    return true;
  }
}
