import { Controller, Get, Param, Post } from '@nestjs/common';
import { Attachment } from './attachment.entity';
import { AttachmentsService } from './attachments.service';

@Controller('attachments')
export class AttachmentsController {
  constructor(private attachmentService: AttachmentsService) {}

  @Post()
  create(): Promise<Attachment> {
    return this.attachmentService.create();
  }

  @Get()
  findAll(): Promise<Attachment[]> {
    return this.attachmentService.findAll();
  }

  @Get(':id')
  findOneBy(@Param('id') id: number): Promise<Attachment | null> {
    return this.attachmentService.findOne(id);
  }
}
