import { Module } from '@nestjs/common';
import { Attachment } from './attachment.entity';
import { AttachmentsService } from './attachments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationsAttachmentsController } from './conversations-attachments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Attachment])],
  providers: [AttachmentsService],
  controllers: [ConversationsAttachmentsController],
  exports: [AttachmentsService],
})
export class AttachmentsModule {}
