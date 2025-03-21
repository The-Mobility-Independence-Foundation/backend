import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { User } from '../user/entities/user.entity';
import { Forum } from '../forum/forum.entity';
import { Prefix } from '../prefix/prefix.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Forum)
    private forumRepository: Repository<Forum>,

    @InjectRepository(Prefix)
    private prefixRepository: Repository<Prefix>,
  ) {}

  async create() {
    const post = new Post();

    const user = await this.userRepository.findOneBy({ id: 1 });
    const prefix = await this.prefixRepository.findOneBy({ id: 1 });
    const forum = await this.forumRepository.findOneBy({ id: 1 });

    if (user) {
      post.user = user;
    }
    if (prefix) {
      post.prefix = prefix;
    }
    if (forum) {
      post.forum = forum;
    }

    post.title = 'Seized wheel nut';
    post.numberOfComments = 2;
    post.content = 'Anyone know of a good mechanic near ROC';

    return this.postRepository.save(post);
  }

  async findAll() {
    return this.postRepository.find();
  }

  async findOne(id: number) {
    return this.postRepository.findOneBy({ id: id });
  }

  /**
   * Find a post by id
   * @param id - The id of the post
   * @param options - Optional query options
   * @returns The post record
   */
  async findById(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<Post, 'id'>>;
      relations: FindOptionsRelations<Post>;
    }> = {},
  ) {
    const { where = {}, relations } = options;

    const post = await this.postRepository.findOne({
      where: {
        ...where,
        id: id,
      },
      relations,
    });

    if (post) {
      return post;
    } else {
      throw new NotFoundException('Post does not exist.');
    }
  }
}
