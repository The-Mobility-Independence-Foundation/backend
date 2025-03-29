import { Test, TestingModule } from '@nestjs/testing';
import { ModelTypeController } from '../model-type.controller';

describe('ModelTypeController', () => {
  let controller: ModelTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModelTypeController],
    }).compile();

    controller = module.get<ModelTypeController>(ModelTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
