import { Test, TestingModule } from '@nestjs/testing';
import { UsersConversationsController } from '../users-conversations.controller';
import { createMock } from '@golevelup/ts-jest';
import { STRATEGY_PROVIDERS_TOKEN } from '../../common/resource-access/interfaces/strategy-provider.interface';
import { ResourceAccessStrategyRegistry } from '../../common/resource-access/interfaces/strategy-provider.interface';
export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('UserConversationsController', () => {
  let controller: UsersConversationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersConversationsController],
      providers: [
        {
          provide: STRATEGY_PROVIDERS_TOKEN,
          useValue: createMock<ResourceAccessStrategyRegistry>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<UsersConversationsController>(
      UsersConversationsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
