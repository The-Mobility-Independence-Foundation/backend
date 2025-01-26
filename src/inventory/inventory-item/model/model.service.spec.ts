import { Test, TestingModule } from '@nestjs/testing';
import { ModelService } from './model.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Manufacturer, Model, ModelType } from './model.entity';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('ModelService', () => {
  let service: ModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModelService,
        {
          provide: getRepositoryToken(Model), 
          useClass: mockRepository
        },
        {
          provide: getRepositoryToken(Manufacturer), 
          useClass: mockRepository
        },
      ]
    }).compile();

    service = module.get<ModelService>(ModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
