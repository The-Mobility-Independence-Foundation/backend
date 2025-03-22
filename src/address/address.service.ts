import { Injectable, NotFoundException } from '@nestjs/common';
import { Address } from './address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(): Promise<Address> {
    const address = new Address();

    address.addressLine1 = '1789 State Highway 8';
    address.city = 'Mount Upton';
    address.state = 'New York';
    address.zipCode = '13809';

    return this.addressRepository.save(address);
  }

  async findOne(id: number): Promise<Address | null> {
    return this.addressRepository.findOneBy({ id: id });
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

    if(address){
      return address;
    }
    else{
      throw new NotFoundException('Address not found.');
    }
  }
}
