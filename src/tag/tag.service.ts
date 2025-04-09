import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
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

  async findByIdOrThrow(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<Tag, 'id'>>;
      relations: string[] | FindOptionsRelations<Tag>;
    }> = {},
  ) {
    const { where = {}, relations } = options;

    const tag = await this.tagRepository.findOne({
      where: {
        ...where,
        id,
      },
      relations: relations as string[],
    });

    if (tag) {
      return tag;
    } else {
      throw new NotFoundException('Inventory not found');
    }
  }
}
