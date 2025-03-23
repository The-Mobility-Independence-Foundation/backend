import { Global, Module } from '@nestjs/common';
import { UserResourceAccessStrategy } from './strategies/user-resource-access.strategy';
import { ConversationResourceAccessStrategy } from './strategies/conversation-resource-access.strategy';
import { ResourceAccessGuard } from './guards/resource-access.guard';
import {
  ResourceAccessStrategyToken,
  ResourceAccessStrategyRegistry,
  STRATEGY_PROVIDERS_TOKEN,
} from './interfaces/strategy-provider.interface';
import { UserMeResourceAccessStrategy } from './strategies/user-me-resource-access.strategy';
import { ConversationModule } from '../../conversation/conversation.module';

const STRATEGY_PROVIDERS = [
  {
    provide: ResourceAccessStrategyToken.USER,
    useClass: UserResourceAccessStrategy,
  },
  {
    provide: ResourceAccessStrategyToken.USER_ME,
    useClass: UserMeResourceAccessStrategy,
  },
  {
    provide: ResourceAccessStrategyToken.CONVERSATION,
    useClass: ConversationResourceAccessStrategy,
  },
] as const;

@Global()
@Module({
  imports: [ConversationModule],
  providers: [
    ResourceAccessGuard,
    ...STRATEGY_PROVIDERS,
    {
      provide: STRATEGY_PROVIDERS_TOKEN,
      useFactory: (
        userStrategy: UserResourceAccessStrategy,
        conversationStrategy: ConversationResourceAccessStrategy,
        userMeStrategy: UserMeResourceAccessStrategy,
      ): ResourceAccessStrategyRegistry => ({
        [ResourceAccessStrategyToken.USER]: userStrategy,
        [ResourceAccessStrategyToken.CONVERSATION]: conversationStrategy,
        [ResourceAccessStrategyToken.USER_ME]: userMeStrategy,
      }),
      inject: STRATEGY_PROVIDERS.map((provider) => provider.provide),
    },
  ],
  exports: [STRATEGY_PROVIDERS_TOKEN],
})
export class ResourceAccessModule {}
