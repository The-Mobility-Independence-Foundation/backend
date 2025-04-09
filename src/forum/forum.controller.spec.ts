import { Test, TestingModule } from '@nestjs/testing';
import { ForumController } from './forum.controller';
import { ForumService } from './forum.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Forum } from './forum.entity';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('ForumController', () => {
  let controller: ForumController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForumController],
      providers: [
        ForumService,
        {
          provide: getRepositoryToken(Forum),
          useClass: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<ForumController>(ForumController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
