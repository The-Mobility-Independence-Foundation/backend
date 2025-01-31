import { Injectable } from '@nestjs/common';
import { Forum } from '../forum/forum.entity';
import { Prefix } from './prefix.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PrefixService {
  constructor(
    @InjectRepository(Forum)
    private forumRepository: Repository<Forum>,

    @InjectRepository(Prefix)
    private prefixRepository: Repository<Prefix>,
  ) {}

  async create() {
    const prefix = new Prefix();

    const forum = await this.forumRepository.findOneBy({ id: 1 });
    if (forum) {
      prefix.forumsUsed = forum;
    }

    prefix.name = 'Power Chair';

    return this.prefixRepository.save(prefix);
  }

  async findAll() {
    return this.prefixRepository.find();
  }

  async findOne(id: number) {
    return this.prefixRepository.findOneBy({ id: id });
  }
}
