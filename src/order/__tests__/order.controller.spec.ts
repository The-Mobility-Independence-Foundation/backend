import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../order.controller';
import {
  ResourceAccessStrategyRegistry,
  STRATEGY_PROVIDERS_TOKEN,
} from '../../common/resource-access/interfaces/strategy-provider.interface';
import { createMock } from '@golevelup/ts-jest';

describe('OrderController', () => {
  let controller: OrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: STRATEGY_PROVIDERS_TOKEN,
          useValue: createMock<ResourceAccessStrategyRegistry>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
