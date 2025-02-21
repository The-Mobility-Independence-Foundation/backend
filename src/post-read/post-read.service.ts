import { Injectable } from '@nestjs/common';
import { PostRead } from './post-read.entity';
import { User } from '../user/entities/user.entity';
import { Post } from '../post/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostReadService {
  constructor(
    @InjectRepository(PostRead)
    private postreadRepository: Repository<PostRead>,

    @InjectRepository(Post)
    private postRepository: Repository<Post>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create() {
    const postRead = new PostRead();

    const post = await this.postRepository.findOneBy({ id: 1 });
    const user = await this.userRepository.findOneBy({ id: 1 });

    if (post) {
      postRead.post = post;
    }

    if (user) {
      postRead.user = user;
    }

    return this.postreadRepository.save(postRead);
  }

  async findAll() {
    return this.postreadRepository.find();
  }

  async findOne(id: number) {
    return this.postreadRepository.findOneBy({ id: id });
  }
}
