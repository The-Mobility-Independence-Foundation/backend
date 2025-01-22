import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkService } from './bookmark.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bookmark } from './bookmark.entity';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('BookmarkService', () => {
  let service: BookmarkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmarkService,
        {
          provide: getRepositoryToken(Bookmark), 
          useClass: mockRepository
        }
      ],
    }).compile();

    service = module.get<BookmarkService>(BookmarkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
