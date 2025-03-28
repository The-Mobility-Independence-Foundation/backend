import { Global, Module } from '@nestjs/common';
import { UserResourceAccessStrategy } from './strategies/user-resource-access.strategy';
import { ConversationResourceAccessStrategy } from './strategies/conversation-resource-access.strategy';
import { ResourceAccessGuard } from './guards/resource-access.guard';
import {
  ResourceAccessStrategyToken,
  ResourceAccessStrategyRegistry,
  STRATEGY_PROVIDERS_TOKEN,
} from './interfaces/strategy-provider.interface';
import { ConversationModule } from '../../conversation/conversation.module';
import { PublicUserResourceAccessStrategy } from './strategies/public-user-resource-access.strategy';
import { GuestResourceAccessStrategy } from './strategies/guest-resource-access.strategy';
import { AnyUserResourceAccessStrategy } from './strategies/any-user-resource-access.strategy';
import { OrganizationOwnerResourceAccessStrategy } from './strategies/organization-owner-resource-access.strategy';
import { OrganizationModule } from '../../organization/organization.module';

const STRATEGY_PROVIDERS = [
  {
    provide: ResourceAccessStrategyToken.ANY_USER,
    useClass: AnyUserResourceAccessStrategy,
  },
  {
    provide: ResourceAccessStrategyToken.GUEST,
    useClass: GuestResourceAccessStrategy,
  },
  {
    provide: ResourceAccessStrategyToken.USER,
    useClass: UserResourceAccessStrategy,
  },
  {
    provide: ResourceAccessStrategyToken.PUBLIC_USER,
    useClass: PublicUserResourceAccessStrategy,
  },
  {
    provide: ResourceAccessStrategyToken.CONVERSATION,
    useClass: ConversationResourceAccessStrategy,
  },
  {
    provide: ResourceAccessStrategyToken.ORGANIZATION_OWNER,
    useClass: OrganizationOwnerResourceAccessStrategy,
  },
] as const;

@Global()
@Module({
  imports: [ConversationModule, OrganizationModule],
  providers: [
    ResourceAccessGuard,
    ...STRATEGY_PROVIDERS,
    {
      provide: STRATEGY_PROVIDERS_TOKEN,
      // Ensure the order matches the STRATEGY_PROVIDERS array order
      useFactory: (
        anyUserStrategy: AnyUserResourceAccessStrategy,
        guestStrategy: GuestResourceAccessStrategy,
        userStrategy: UserResourceAccessStrategy,
        publicUserStrategy: PublicUserResourceAccessStrategy,
        conversationStrategy: ConversationResourceAccessStrategy,
        organizationOwnerStrategy: OrganizationOwnerResourceAccessStrategy,
      ): ResourceAccessStrategyRegistry => ({
        [ResourceAccessStrategyToken.ANY_USER]: anyUserStrategy,
        [ResourceAccessStrategyToken.GUEST]: guestStrategy,
        [ResourceAccessStrategyToken.USER]: userStrategy,
        [ResourceAccessStrategyToken.PUBLIC_USER]: publicUserStrategy,
        [ResourceAccessStrategyToken.CONVERSATION]: conversationStrategy,
        [ResourceAccessStrategyToken.ORGANIZATION_OWNER]:
          organizationOwnerStrategy,
      }),
      inject: STRATEGY_PROVIDERS.map((provider) => provider.provide),
    },
  ],
  exports: [STRATEGY_PROVIDERS_TOKEN],
})
export class ResourceAccessModule {}
