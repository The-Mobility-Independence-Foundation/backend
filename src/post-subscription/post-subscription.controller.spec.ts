import { Test, TestingModule } from '@nestjs/testing';
import { PostSubscriptionController } from './post-subscription.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Post } from '../post/post.entity';
import { PostSubscription } from './post-subscription.entity';
import { PostSubscriptionService } from './post-subscription.service';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('PostSubscriptionController', () => {
  let controller: PostSubscriptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostSubscriptionController],
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

    controller = module.get<PostSubscriptionController>(
      PostSubscriptionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
