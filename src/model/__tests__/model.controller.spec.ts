import { Test, TestingModule } from '@nestjs/testing';
import { ModelController } from '../model.controller';
import { createMock } from '@golevelup/ts-jest';
import { STRATEGY_PROVIDERS_TOKEN, ResourceAccessStrategyRegistry } from '../../common/resource-access/interfaces/strategy-provider.interface';

describe('ModelController', () => {
  let controller: ModelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModelController],
      providers: [
        {
          provide: STRATEGY_PROVIDERS_TOKEN,
          useValue: createMock<ResourceAccessStrategyRegistry>(),
        },
      ],
    })
    .useMocker(createMock)
    .compile();

    controller = module.get(ModelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
