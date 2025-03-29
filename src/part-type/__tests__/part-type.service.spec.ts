import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PartType } from '../../part/part.entity';
import { Repository } from 'typeorm';
import { PartTypeService } from '../part-type.service';

describe('PartTypeService', () => {
  let service: PartTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartTypeService,
        {
          provide: getRepositoryToken(PartType),
          useValue: createMock<Repository<PartType>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(PartTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
