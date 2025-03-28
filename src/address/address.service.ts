import { Injectable, NotFoundException } from '@nestjs/common';
import { Address } from './address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(dto: CreateAddressDto) {
    const address = new Address();

    Object.assign(address, dto);

    return this.addressRepository.save(address);
  }

  async update(id: number, dto: UpdateAddressDto) {
    const address = await this.findByIdOrThrow(id);

    Object.assign(address, dto);

    return this.addressRepository.save(address);
  }

  async findAll(): Promise<Address[]> {
    return this.addressRepository.find();
  }

  async findByIdOrThrow(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<Address, 'id'>>;
      relations: string[] | FindOptionsRelations<Address>;
    }> = {},
  ) {
    const { where = {}, relations } = options;

    const address = await this.addressRepository.findOne({
      where: {
        ...where,
        id,
      },
      relations: relations as string[],
    });

    if (address) {
      return address;
    } else {
      throw new NotFoundException('Address not found.');
    }
  }
}
