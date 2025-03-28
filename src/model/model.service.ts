import { Injectable, NotFoundException } from '@nestjs/common';
import { Manufacturer, Model } from './model.entity';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,

    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,
  ) {}

  /**
   *
   * @returns
   */
  async create() {
    const model = new Model();
    const manufacturer = await this.manufacturerRepository.findOneBy({ id: 1 });

    if (manufacturer) {
      model.manufacturer = manufacturer;
    }
    model.name = 'Model Name';
    model.year = 2025;

    return this.modelRepository.save(model);
  }

  /**
   *
   * @returns
   */
  async findAll() {
    return this.modelRepository.find();
  }

  /**
   *
   * @param id
   * @returns
   */
  async findOne(id: number) {
    return this.modelRepository.findOneBy({ id: id });
  }

  /**
   * Finds a specific model based on the ID given
   * @param id : ID of the model being looked for
   * @param options : Any specific options needed to search
   * @returns : The model and any information
   */
  async findByIdOrThrow(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<Model, 'id'>>;
      relations: string[] | FindOptionsRelations<Model>;
    }> = {},
  ) {
    const { where = {}, relations } = options;

    const model = await this.modelRepository.findOne({
      where: {
        ...where,
        id,
      },
      relations: relations as string[],
    });

    if (model) {
      return model;
    } else {
      throw new NotFoundException('Model not found');
    }
  }
}
