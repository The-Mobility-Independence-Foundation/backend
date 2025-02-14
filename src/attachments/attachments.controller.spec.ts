import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Message } from '../message/message.entity';
import { Listing } from '../listing/listing.entity';
import { User } from '../user/user.entity';
import { Attachment } from './attachment.entity';
import { AttachmentsController } from './attachments.controller';
import { mockRepository } from './attachments.service.spec';
import { Post as PostEntity } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';
import { AttachmentsService } from './attachments.service';

describe('AttachmentsController', () => {
  let controller: AttachmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttachmentsController],
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
        {
          provide: getRepositoryToken(Message),
          useClass: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<AttachmentsController>(AttachmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
