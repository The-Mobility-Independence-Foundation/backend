import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Forum } from '../forum/forum.entity';
import { Prefix } from '../prefix/prefix.entity';
import { User } from '../user/user.entity';
import { PostController } from './post.controller';
import { Post } from './post.entity';
import { PostService } from './post.service';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('PostController', () => {
  let controller: PostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post), 
          useClass: mockRepository
        },
        {
          provide: getRepositoryToken(User), 
          useClass: mockRepository
        },
        {
          provide: getRepositoryToken(Forum), 
          useClass: mockRepository
        },
        {
          provide: getRepositoryToken(Prefix), 
          useClass: mockRepository
        },
      ]
    }).compile();

    controller = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
