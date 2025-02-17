import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { Attachment } from './attachment.entity';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private attachmentRepository: Repository<Attachment>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create() {
    const attachment = new Attachment();

    const user = await this.userRepository.findOneBy({ id: 1 });

    if (user) {
      attachment.author = user;
    }

    attachment.entity_id = 2;
    attachment.file_name = 'brake diagram';
    attachment.file_size = '10 MB';
    attachment.mime_type = '.avif';
    attachment.storage_url = 'user/blueprints/brakes/brakeDiagram.pdf';

    return this.attachmentRepository.save(attachment);
  }

  async findAll() {
    return this.attachmentRepository.find();
  }

  async findOne(id: number) {
    return this.attachmentRepository.findOneBy({ id: id });
  }
}
