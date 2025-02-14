import { Test, TestingModule } from '@nestjs/testing';
import { AttachmentsService } from './attachments.service';
import { Listing } from '../listing/listing.entity';
import { Post as PostEntity } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';
import { Attachment } from './attachment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Message } from '../message/message.entity';
import { User } from '../user/user.entity';

export const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('AttachmentsService', () => {
  let service: AttachmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttachmentsService,
        {
          provide: getRepositoryToken(Attachment),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: mockRepository,
        },
        {
          provide: getRepositoryToken(Message),
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

    service = module.get<AttachmentsService>(AttachmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
