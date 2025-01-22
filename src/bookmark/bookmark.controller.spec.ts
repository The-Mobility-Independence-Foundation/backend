import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bookmark } from './bookmark.entity';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('BookmarkController', () => {
  let controller: BookmarkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookmarkController],
      providers: [
        BookmarkService, 
        {
          provide: getRepositoryToken(Bookmark), 
          useClass: mockRepository
        }
      ]
    }).compile();

    controller = module.get<BookmarkController>(BookmarkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
