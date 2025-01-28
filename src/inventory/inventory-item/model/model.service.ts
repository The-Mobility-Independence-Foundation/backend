import { Injectable } from '@nestjs/common';
import { Manufacturer, Model } from './model.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,

    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,
  ) {}

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

  async findAll() {
    return this.modelRepository.find();
  }

  async findOne(id: number) {
    return this.modelRepository.findOneBy({ id: id });
  }
}
