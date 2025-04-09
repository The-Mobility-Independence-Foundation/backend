import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { PostReadController } from './post-read.controller';
import { PostRead } from './post-read.entity';
import { PostReadService } from './post-read.service';
import { Post } from '../post/post.entity';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('PostReadController', () => {
  let controller: PostReadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostReadController],
      providers: [
        PostReadService,
        {
          provide: getRepositoryToken(PostRead),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(Post),
          useClass: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<PostReadController>(PostReadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
