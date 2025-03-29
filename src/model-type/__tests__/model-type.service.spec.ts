import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ModelType } from '../../model/model.entity';
import { Repository } from 'typeorm';
import { ModelTypeService } from '../model-type.service';

describe('ModelTypeService', () => {
  let service: ModelTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModelTypeService,
      {
        provide: getRepositoryToken(ModelType),
        useValue: createMock<Repository<ModelType>>(),
      }],
    })
    .useMocker(createMock)
    .compile();

    service = module.get<ModelTypeService>(ModelTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
