import { Test, TestingModule } from '@nestjs/testing';
import { PartService } from '../part.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Part } from '../part.entity';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';

describe('PartService', () => {
  let service: PartService;
  //let partRepository: Repository<Part>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartService,
        {
          provide: getRepositoryToken(Part),
          useValue: createMock<Repository<Part>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(PartService);
    //partRepository = module.get(getRepositoryToken(Part));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
