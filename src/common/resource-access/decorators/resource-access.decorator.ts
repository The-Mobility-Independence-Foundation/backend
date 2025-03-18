import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { ResourceAccessGuard } from '../guards/resource-access.guard';
import { ResourceAccessOptions } from '../interfaces/resource-access-options.interface';
import { ResourceAccessStrategyToken } from '../interfaces/strategy-provider.interface';
/**
 * Metadata key for resource access control
 */
export const RESOURCE_ACCESS = 'resource_access';

/**
 * Decorator to set resource access control
 * @param options Configuration options for resource access
 * @returns A decorator function
 */
export function ResourceAccess(options: ResourceAccessOptions = {}) {
  return applyDecorators(
    SetMetadata(RESOURCE_ACCESS, options),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, ResourceAccessGuard),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden' }),
  );
}

/**
 * Decorator to set resource access to admins and moderators
 * @param options Configuration options for resource access
 * @returns A decorator function
 */
export function ModeratorAccess(
  options: Omit<ResourceAccessOptions, 'moderatorAccess'> = {},
) {
  return ResourceAccess({ ...options, moderatorAccess: true });
}

/**
 * Decorator to set resource access to only admins
 * @param options Configuration options for resource access
 * @returns A decorator function
 */
export function AdminOnly(
  options: Omit<ResourceAccessOptions, 'adminOnly'> = {},
) {
  return ResourceAccess({ ...options, adminOnly: true });
}

/**
 * Decorator to set resource access using a strategy provider
 * @param providerToken The token of the strategy provider
 * @param config Configuration for the strategy
 * @param options Additional configuration options
 * @returns A decorator function
 */
export function UseStrategy(
  providerToken: ResourceAccessStrategyToken,
  options: Omit<ResourceAccessOptions, 'strategy'> = {},
) {
  return ResourceAccess({
    ...options,
    strategy: {
      providerToken,
    },
  });
}
