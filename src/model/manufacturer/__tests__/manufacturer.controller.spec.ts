import { Test, TestingModule } from '@nestjs/testing';
import { ManufacturerController } from '../manufacturer.controller';
import { createMock } from '@golevelup/ts-jest';
import {
  ResourceAccessStrategyRegistry,
  STRATEGY_PROVIDERS_TOKEN,
} from '../../../common/resource-access/interfaces/strategy-provider.interface';

describe('ModelController', () => {
  let controller: ManufacturerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManufacturerController],
      providers: [
        {
          provide: STRATEGY_PROVIDERS_TOKEN,
          useValue: createMock<ResourceAccessStrategyRegistry>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get(ManufacturerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
