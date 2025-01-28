import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create() {
    const tag = new Tag();

    tag.name = 'Test tag name.';

    return this.tagRepository.save(tag);
  }

  async findAll() {
    return this.tagRepository.find();
  }

  async findOne(id: number) {
    return this.tagRepository.findOneBy({ id: id });
  }
}
