import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  STRATEGY_PROVIDERS_TOKEN,
  ResourceAccessStrategyRegistry,
} from '../../common/resource-access/interfaces/strategy-provider.interface';
import { PartTypeController } from '../part-type.controller';

describe('PartTypeController', () => {
  let controller: PartTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartTypeController],
      providers: [
        {
          provide: STRATEGY_PROVIDERS_TOKEN,
          useValue: createMock<ResourceAccessStrategyRegistry>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get(PartTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
