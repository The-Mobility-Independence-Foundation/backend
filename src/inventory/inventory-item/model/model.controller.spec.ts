import { Test, TestingModule } from '@nestjs/testing';
import { ModelController } from './model.controller';
import { ModelService } from './model.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Manufacturer, Model, ModelType } from './model.entity';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('ModelController', () => {
  let controller: ModelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModelController],
      providers: [
        ModelService,
        {
          provide: getRepositoryToken(Model),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(Manufacturer),
          useClass: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<ModelController>(ModelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
