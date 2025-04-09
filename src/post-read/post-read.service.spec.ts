import { Test, TestingModule } from '@nestjs/testing';
import { PostReadService } from './post-read.service';
import { PostRead } from './post-read.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Post } from '../post/post.entity';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('PostReadService', () => {
  let service: PostReadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<PostReadService>(PostReadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
