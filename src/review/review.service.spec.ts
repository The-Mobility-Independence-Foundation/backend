import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { Review } from './review.entity';
import { User } from '../user/entities/user.entity';
import { Order } from '../order/order.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('ReviewService', () => {
  let service: ReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: getRepositoryToken(Review),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(Order),
          useClass: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
