import { Type } from '@nestjs/common';
import { ResourceAccessStrategy } from '../strategies/resource-access.strategy';

/**
 * Token for injecting the strategy providers registry
 */
export const STRATEGY_PROVIDERS_TOKEN = 'STRATEGY_PROVIDERS';

/**
 * Enum for resource access strategy tokens
 */
export enum ResourceAccessStrategyToken {
  USER = 'USER_STRATEGY',
  USER_ME = 'USER_ME_STRATEGY',
  CONVERSATION = 'CONVERSATION_STRATEGY',
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
