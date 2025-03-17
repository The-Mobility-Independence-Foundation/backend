import { Test, TestingModule } from '@nestjs/testing';
import { UserConversationsController } from '../user-conversations.controller';
import { createMock } from '@golevelup/ts-jest';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('UserConversationsController', () => {
  let controller: UserConversationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserConversationsController],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<UserConversationsController>(
      UserConversationsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
