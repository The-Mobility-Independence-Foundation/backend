import { Module } from '@nestjs/common';
import { Post as PostEntity } from '../post/post.entity';
import { Message } from '../message/message.entity';
import { Attachment } from './attachment.entity';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from '../listing/listing.entity';
import { User } from '../user/user.entity';
import { Comment } from '../comment/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Attachment,
      User,
      PostEntity,
      Listing,
      Comment,
      Message,
    ]),
  ],
  controllers: [AttachmentsController],
  providers: [AttachmentsService],
})
export class AttachmentsModule {}
