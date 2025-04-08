import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkController } from '../bookmarks.controller';
import { createMock } from '@golevelup/ts-jest';

describe('BookmarksController', () => {
  let controller: BookmarkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookmarkController],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get(BookmarkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
