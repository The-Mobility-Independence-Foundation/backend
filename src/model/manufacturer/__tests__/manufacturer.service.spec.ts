import { Test, TestingModule } from '@nestjs/testing';
import { ManufacturerService } from '../manufacturer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Manufacturer } from '../../model.entity';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';

describe('ModelService', () => {
  let service: ManufacturerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ManufacturerService,
        {
          provide: getRepositoryToken(Manufacturer),
          useValue: createMock<Repository<Manufacturer>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<ManufacturerService>(ManufacturerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
