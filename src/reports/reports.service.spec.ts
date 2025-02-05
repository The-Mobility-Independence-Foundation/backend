import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Listing } from '../listing/listing.entity';
import { Post as PostEntity } from '../post/post.entity';
import { User } from '../user/user.entity';
import { Report } from './report.entity';
import { ReportsService } from './reports.service';
import { Comment } from '../comment/comment.entity';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('ReportsService', () => {
  let service: ReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Report),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(Listing),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(PostEntity),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(Comment),
          useClass: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
