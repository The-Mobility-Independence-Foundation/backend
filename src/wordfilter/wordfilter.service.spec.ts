import { Test, TestingModule } from '@nestjs/testing';
import { WordfilterService } from './wordfilter.service';
import { Wordfilter } from './wordfilter.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('WordfilterService', () => {
  let service: WordfilterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WordfilterService,
        {
          provide: getRepositoryToken(Wordfilter),
          useClass: mockRepository,
        },
      ],
    }).compile();

    service = module.get<WordfilterService>(WordfilterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
