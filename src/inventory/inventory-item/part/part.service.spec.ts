import { Test, TestingModule } from '@nestjs/testing';
import { PartService } from './part.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Part, PartType } from './part.entity';
import { Tag } from '../tag/tag.entity';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('PartService', () => {
  let service: PartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartService,
        {
          provide: getRepositoryToken(Part), 
          useClass: mockRepository
        },
        {
          provide: getRepositoryToken(PartType), 
          useClass: mockRepository
        },
        {
          provide: getRepositoryToken(Tag), 
          useClass: mockRepository
        },
      ]
    }).compile();

    service = module.get<PartService>(PartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
