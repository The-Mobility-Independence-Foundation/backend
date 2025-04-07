import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { STRATEGY_PROVIDERS_TOKEN, ResourceAccessStrategyRegistry } from '../../common/resource-access/interfaces/strategy-provider.interface';
import { RequestController } from '../request.controller';


describe('RequestController', () => {
  let controller: RequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestController],
      providers: [
        {
          provide: STRATEGY_PROVIDERS_TOKEN,
          useValue: createMock<ResourceAccessStrategyRegistry>(),
        },
      ],
    })
    .useMocker(createMock)
    .compile();

    controller = module.get(RequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
