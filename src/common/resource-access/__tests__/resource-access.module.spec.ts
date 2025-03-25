import { TestingModule, Test } from '@nestjs/testing';
import { ResourceAccessModule } from '../resource-access.module';
import { ResourceAccessGuard } from '../guards/resource-access.guard';
import {
  ResourceAccessStrategyRegistry,
  ResourceAccessStrategyToken,
  STRATEGY_PROVIDERS_TOKEN,
} from '../interfaces/strategy-provider.interface';
import { createMock } from '@golevelup/ts-jest';
import { UserResourceAccessStrategy } from '../strategies/user-resource-access.strategy';
import { ConversationResourceAccessStrategy } from '../strategies/conversation-resource-access.strategy';
import { PublicUserResourceAccessStrategy } from '../strategies/public-user-resource-access.strategy';
import { AnyUserResourceAccessStrategy } from '../strategies/any-user-resource-access.strategy';
import { GuestResourceAccessStrategy } from '../strategies/guest-resource-access.strategy';

describe('ResourceAccessModule', () => {
  let module: TestingModule;
  let registry: ResourceAccessStrategyRegistry;
  let guard: ResourceAccessGuard;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ResourceAccessModule],
      providers: [
        {
          provide: STRATEGY_PROVIDERS_TOKEN,
          useValue: createMock<ResourceAccessStrategyRegistry>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    registry = module.get(STRATEGY_PROVIDERS_TOKEN);
    guard = module.get(ResourceAccessGuard);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('ResourceAccessStrategyRegistry should be defined', () => {
    expect(registry).toBeDefined();
  });

  it('ResourceAccessGuard should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should provide AnyUserResourceAccessStrategy', () => {
    const strategy = registry[ResourceAccessStrategyToken.ANY_USER];

    expect(strategy).toBeDefined();
    expect(strategy).toBeInstanceOf(AnyUserResourceAccessStrategy);
  });

  it('should provide GuestResourceAccessStrategy', () => {
    const strategy = registry[ResourceAccessStrategyToken.GUEST];

    expect(strategy).toBeDefined();
    expect(strategy).toBeInstanceOf(GuestResourceAccessStrategy);
  });

  it('should provide UserResourceAccessStrategy', () => {
    const strategy = registry[ResourceAccessStrategyToken.USER];

    expect(strategy).toBeDefined();
    expect(strategy).toBeInstanceOf(UserResourceAccessStrategy);
  });

  it('should provide PublicUserResourceAccessStrategy', () => {
    const strategy = registry[ResourceAccessStrategyToken.PUBLIC_USER];

    expect(strategy).toBeDefined();
    expect(strategy).toBeInstanceOf(PublicUserResourceAccessStrategy);
  });

  it('should provide ConversationResourceAccessStrategy', () => {
    const strategy = registry[ResourceAccessStrategyToken.CONVERSATION];

    expect(strategy).toBeDefined();
    expect(strategy).toBeInstanceOf(ConversationResourceAccessStrategy);
  });
});
