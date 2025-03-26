import { ResourceAccessStrategyToken } from './strategy-provider.interface';

/**
 * Interface for resource access options
 */
export interface ResourceAccessOptions {
  strategy?: {
    providerToken: ResourceAccessStrategyToken;
  };
  adminOnly?: boolean;
  moderatorAccess?: boolean;
  forbiddenMessage?: string;
}
