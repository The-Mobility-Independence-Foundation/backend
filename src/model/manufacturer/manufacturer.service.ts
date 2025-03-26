import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manufacturer } from '../model.entity';

@Injectable()
export class ManufacturerService {
  constructor(
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,
  ) {}

  async findAll(): Promise<Manufacturer[]> {
    return this.manufacturerRepository.find({ relations: ['models'] });
  }

  async findOne(id: number): Promise<Manufacturer> {
    const manufacturer = await this.manufacturerRepository.findOneBy({ id });
    if (!manufacturer) {
      throw new NotFoundException(`Manufacturer not found`);
    }
    return manufacturer;
  }

  async create(): Promise<Manufacturer> {
    const manufacturer = this.manufacturerRepository.create();
    return this.manufacturerRepository.save(manufacturer);
  }

  async update(id: number, name: string): Promise<Manufacturer> {
    await this.manufacturerRepository.update(id, { name });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.manufacturerRepository.delete(id);
  }
}
