import { Test, TestingModule } from '@nestjs/testing';
import { InventoryItemController } from '../inventory-item.controller';
import { createMock } from '@golevelup/ts-jest';
import {
  ResourceAccessStrategyRegistry,
  STRATEGY_PROVIDERS_TOKEN,
} from '../../common/resource-access/interfaces/strategy-provider.interface';

describe('InventoryItemController', () => {
  let controller: InventoryItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryItemController],
      providers: [
        {
          provide: STRATEGY_PROVIDERS_TOKEN,
          useValue: createMock<ResourceAccessStrategyRegistry>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<InventoryItemController>(InventoryItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
