import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Listing } from '../../listing/listing.entity';
import { Post as PostEntity } from '../../post/post.entity';
import { User } from '../../user/entities/user.entity';
import { Report } from '../report.entity';
import { ReportsController } from '../reports.controller';
import { ReportsService } from '../reports.service';
import { mockRepository } from './reports.service.spec';
import { Comment } from '../../comment/comment.entity';

describe('ReportsController', () => {
  let controller: ReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
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

    controller = module.get<ReportsController>(ReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
