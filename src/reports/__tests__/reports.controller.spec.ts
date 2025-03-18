import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Listing } from '../../listing/listing.entity';
import { Post as PostEntity } from '../../post/post.entity';
import { User } from '../../user/entities/user.entity';
import { Report } from '../report.entity';
import { ReportsController } from '../reports.controller';
import { ReportsService } from '../reports.service';
import { Comment } from '../../comment/comment.entity';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';

describe('ReportsController', () => {
  let controller: ReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Report),
          useValue: createMock<Repository<Report>>(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: createMock<Repository<User>>(),
        },
        {
          provide: getRepositoryToken(Listing),
          useValue: createMock<Repository<Listing>>(),
        },
        {
          provide: getRepositoryToken(PostEntity),
          useValue: createMock<Repository<PostEntity>>(),
        },
        {
          provide: getRepositoryToken(Comment),
          useValue: createMock<Repository<Comment>>(),
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
