import { Test, TestingModule } from '@nestjs/testing';
import { ListingsController } from '../listings.controller';
import { createMock } from '@golevelup/ts-jest';
import { STRATEGY_PROVIDERS_TOKEN } from '../../common/resource-access/interfaces/strategy-provider.interface';
import { ResourceAccessStrategyRegistry } from '../../common/resource-access/interfaces/strategy-provider.interface';

describe('ListingsController', () => {
  let controller: ListingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListingsController],
      providers: [
        {
          provide: STRATEGY_PROVIDERS_TOKEN,
          useValue: createMock<ResourceAccessStrategyRegistry>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<ListingsController>(ListingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
