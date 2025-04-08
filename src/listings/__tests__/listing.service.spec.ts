import { Test, TestingModule } from '@nestjs/testing';
import { ListingsService } from '../listings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Listing } from '../listing.entity';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';

describe('ListingsService', () => {
  let service: ListingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingsService,
        {
          provide: getRepositoryToken(Listing),
          useValue: createMock<Repository<Listing>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<ListingsService>(ListingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
