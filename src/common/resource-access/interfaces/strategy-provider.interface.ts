import { Type } from '@nestjs/common';
import { ResourceAccessStrategy } from '../strategies/generic/resource-access.strategy';

/**
 * Token for injecting the strategy providers registry
 */
export const STRATEGY_PROVIDERS_TOKEN = 'STRATEGY_PROVIDERS';

/**
 * Enum for resource access strategy tokens
 */
export enum ResourceAccessStrategyToken {
  ANY_USER = 'ANY_USER_STRATEGY',
  GUEST = 'GUEST_STRATEGY',
  USER = 'USER_STRATEGY',
  PUBLIC_USER = 'PUBLIC_USER_STRATEGY',
  CONVERSATION = 'CONVERSATION_STRATEGY',
  ORGANIZATION_OWNER = 'ORGANIZATION_OWNER_STRATEGY',
  ORGANIZATION_MEMBER = 'ORGANIZATION_MEMBER_STRATEGY',
  ORDER = 'ORDER_STRATEGY',
}

/**
 * Interface for strategy provider registration
 */
export interface ResourceAccessStrategyProvider {
  provide: ResourceAccessStrategyToken;
  useClass: Type<ResourceAccessStrategy>;
  inject?: any[];
}

/**
 * Type for the strategy registry
 */
export type ResourceAccessStrategyRegistry = {
  [K in ResourceAccessStrategyToken]?: ResourceAccessStrategy;
};
