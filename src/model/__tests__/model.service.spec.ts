import { Test, TestingModule } from '@nestjs/testing';
import { ModelService } from '../model.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Manufacturer, Model } from '../model.entity';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';

describe('ModelService', () => {
  let service: ModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModelService,
        {
          provide: getRepositoryToken(Model),
          useValue: createMock<Repository<Model>>(),
        },
        {
          provide: getRepositoryToken(Manufacturer),
          useValue: createMock<Repository<Manufacturer>>(),
        },
      ],
    })
    .useMocker(createMock)
    .compile();

    service = module.get(ModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
