import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Listing } from '../listing/listing.entity';
import { Message } from '../message/message.entity';
import { Post as PostEntity } from '../post/post.entity';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { Attachment } from './attachment.entity';
import { Comment } from '../comment/comment.entity';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private attachmentRepository: Repository<Attachment>,

    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Listing)
    private listingRepository: Repository<Listing>,

    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,

    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async create() {
    const attachment = new Attachment();

    const user = await this.userRepository.findOneBy({ id: 1 });
    const listing = await this.listingRepository.findOneBy({ id: 1 });
    const comment = await this.commentRepository.findOneBy({ id: 1 });
    const message = await this.messageRepository.findOneBy({ id: 1 });
    const post = await this.postRepository.findOneBy({ id: 1 });

    if (user) {
      attachment.author = user;
    }
    if (comment) {
      attachment.comment = comment;
    }
    if (listing) {
      attachment.listing = listing;
    }
    if (message) {
      attachment.message = message;
    }
    if (post) {
      attachment.post = post;
    }

    attachment.entity_id = '2';
    attachment.entity_type = 'diagram';
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
