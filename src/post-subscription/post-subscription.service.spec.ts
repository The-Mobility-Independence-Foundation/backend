import { Test, TestingModule } from '@nestjs/testing';
import { PostSubscriptionService } from './post-subscription.service';
import { PostSubscription } from './post-subscription.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Post } from '../post/post.entity';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('PostSubscriptionService', () => {
  let service: PostSubscriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostSubscriptionService,
        {
          provide: getRepositoryToken(PostSubscription),
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

    service = module.get<PostSubscriptionService>(PostSubscriptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
