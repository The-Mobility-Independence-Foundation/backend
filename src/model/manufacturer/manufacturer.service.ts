import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { Manufacturer } from '../model.entity';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';

@Injectable()
export class ManufacturerService {
  constructor(
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,
  ) {}

  async findAll(): Promise<Manufacturer[]> {
    return this.manufacturerRepository.find({ relations: ['models'] });
  }

  async create(): Promise<Manufacturer> {
    const manufacturer = this.manufacturerRepository.create();
    return this.manufacturerRepository.save(manufacturer);
  }

  async update(id: number, dto: UpdateManufacturerDto): Promise<Manufacturer> {
    await this.manufacturerRepository.update(id, dto);
    return this.findByIdOrThrow(id);
  }

  async findByIdOrThrow(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<Manufacturer, 'id'>>;
      relations: string[] | FindOptionsRelations<Manufacturer>;
    }> = {},
  ) {
    const { where = {}, relations } = options;

    const manufacturer = await this.manufacturerRepository.findOne({
      where: {
        ...where,
        id,
      },
      relations: relations as string[],
    });

    if (manufacturer) {
      return manufacturer;
    } else {
      throw new NotFoundException('Manufacturer not found');
    }
  }
}
