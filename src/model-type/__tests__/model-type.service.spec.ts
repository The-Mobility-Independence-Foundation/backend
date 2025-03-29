import { Test, TestingModule } from '@nestjs/testing';
import { ModelTypeService } from '../model-type.service';

describe('ModelTypeService', () => {
  let service: ModelTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModelTypeService],
    }).compile();

    service = module.get<ModelTypeService>(ModelTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
