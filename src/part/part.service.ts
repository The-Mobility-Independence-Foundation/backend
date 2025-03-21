import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Part } from './part.entity';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { Model } from '../model/model.entity';

@Injectable()
export class PartService {
  constructor(
    @InjectRepository(Part)
    private readonly partRepository: Repository<Part>,

    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
  ) {}

  async create() {
    const part = new Part();
    const model = await this.modelRepository.findOneBy({ id: 1 });

    if (model) {
      part.model = model;
    }

    part.name = 'Partname!';
    part.description = '';
    part.partNumber = 'P12-345';

    return this.partRepository.save(part);
  }

  async findAll() {
    return this.partRepository.find();
  }

  async findOne(id: number) {
    return this.partRepository.findOneBy({ id: id });
  }

  /**
   * Finds a specific part based on the ID given
   * @param id : The ID of the specific part given
   * @param options : Any specific options needed to search
   * @returns : The part and any information
   */
  async findById(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<Part, 'id'>>;
      relations: string[] | FindOptionsRelations<Part>;
    }> = {},
  ) {
    const { where = {}, relations } = options;

    return this.partRepository.findOne({
      where: {
        ...where,
        id,
      },
      relations: relations as string[],
    });
  }
}
