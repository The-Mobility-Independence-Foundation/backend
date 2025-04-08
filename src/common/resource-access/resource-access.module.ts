import { Global, Module } from '@nestjs/common';
import { UserResourceAccessStrategy } from './strategies/user-resource-access.strategy';
import { ConversationResourceAccessStrategy } from './strategies/conversation-resource-access.strategy';
import { ResourceAccessGuard } from './guards/resource-access.guard';
import {
  ResourceAccessStrategyToken,
  ResourceAccessStrategyRegistry,
  STRATEGY_PROVIDERS_TOKEN,
} from './interfaces/strategy-provider.interface';
import { PublicUserResourceAccessStrategy } from './strategies/public-user-resource-access.strategy';
import { GuestResourceAccessStrategy } from './strategies/guest-resource-access.strategy';
import { AnyUserResourceAccessStrategy } from './strategies/any-user-resource-access.strategy';
import { OrganizationOwnerResourceAccessStrategy } from './strategies/organization-owner-resource-access.strategy';
import { OrganizationModule } from '../../organization/organization.module';
import { OrganizationMemberResourceAccessStrategy } from './strategies/organization-member-resource-access.strategy';
import { ConversationsModule } from '../../conversations/conversations.module';
import { OrderResourceAccessStrategy } from './strategies/order-resource-access.strategy';
import { UserModule } from '../../user/user.module';
import { OrderModule } from '../../order/order.module';
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
  {
    provide: ResourceAccessStrategyToken.ORGANIZATION_MEMBER,
    useClass: OrganizationMemberResourceAccessStrategy,
  },
  {
    provide: ResourceAccessStrategyToken.ORDER,
    useClass: OrderResourceAccessStrategy,
  },
] as const;

@Global()
@Module({
  imports: [ConversationsModule, OrganizationModule, UserModule, OrderModule],
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
        organizationMemberStrategy: OrganizationMemberResourceAccessStrategy,
        orderStrategy: OrderResourceAccessStrategy,
      ): ResourceAccessStrategyRegistry => ({
        [ResourceAccessStrategyToken.ANY_USER]: anyUserStrategy,
        [ResourceAccessStrategyToken.GUEST]: guestStrategy,
        [ResourceAccessStrategyToken.USER]: userStrategy,
        [ResourceAccessStrategyToken.PUBLIC_USER]: publicUserStrategy,
        [ResourceAccessStrategyToken.CONVERSATION]: conversationStrategy,
        [ResourceAccessStrategyToken.ORGANIZATION_OWNER]:
          organizationOwnerStrategy,
        [ResourceAccessStrategyToken.ORGANIZATION_MEMBER]:
          organizationMemberStrategy,
        [ResourceAccessStrategyToken.ORDER]: orderStrategy,
      }),
      inject: STRATEGY_PROVIDERS.map((provider) => provider.provide),
    },
  ],
  exports: [STRATEGY_PROVIDERS_TOKEN],
})
export class ResourceAccessModule {}
