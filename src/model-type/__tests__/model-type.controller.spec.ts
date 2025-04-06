import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  STRATEGY_PROVIDERS_TOKEN,
  ResourceAccessStrategyRegistry,
} from '../../common/resource-access/interfaces/strategy-provider.interface';
import { ModelTypeController } from '../model-type.controller';

describe('ModelTypeController', () => {
  let controller: ModelTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModelTypeController],
      providers: [
        {
          provide: STRATEGY_PROVIDERS_TOKEN,
          useValue: createMock<ResourceAccessStrategyRegistry>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get(ModelTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
