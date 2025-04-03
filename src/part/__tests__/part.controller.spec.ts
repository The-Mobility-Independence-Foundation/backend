import { Test, TestingModule } from '@nestjs/testing';
import { PartController } from '../part.controller';
import { createMock } from '@golevelup/ts-jest';
import { STRATEGY_PROVIDERS_TOKEN, ResourceAccessStrategyRegistry } from '../../common/resource-access/interfaces/strategy-provider.interface';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('PartController', () => {
  let controller: PartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartController],
      providers: [
        {
          provide: STRATEGY_PROVIDERS_TOKEN,
          useValue: createMock<ResourceAccessStrategyRegistry>(),
        },
      ],
    })
    .useMocker(createMock)
    .compile();

    controller = module.get<PartController>(PartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
