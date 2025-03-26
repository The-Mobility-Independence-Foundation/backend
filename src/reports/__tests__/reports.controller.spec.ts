import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from '../reports.controller';
import { createMock } from '@golevelup/ts-jest';
import { ResourceAccessStrategyRegistry, STRATEGY_PROVIDERS_TOKEN } from '../../common/resource-access/interfaces/strategy-provider.interface';

describe('ReportsController', () => {
  let controller: ReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: STRATEGY_PROVIDERS_TOKEN,
          useValue: createMock<ResourceAccessStrategyRegistry>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
