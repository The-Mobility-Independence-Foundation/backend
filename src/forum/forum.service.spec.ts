import { Test, TestingModule } from '@nestjs/testing';
import { ForumService } from './forum.service';
import { Forum } from './forum.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('ForumService', () => {
  let service: ForumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForumService,
        {
          provide: getRepositoryToken(Forum),
          useClass: mockRepository
        }
      ],
    }).compile();

    service = module.get<ForumService>(ForumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
