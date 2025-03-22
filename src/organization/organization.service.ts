import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { Organization } from './organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UserService } from '../user/user.service';
import { CreateAddressDto } from '../address/dto/create-address.dto';
import { AddressService } from '../address/address.service';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,

    private readonly userService: UserService,
    private readonly addressService: AddressService,
  ) {}

  async create(dto: CreateOrganizationDto) {
    const organization = new Organization();
    const owner = this.userService.findById(dto.ownerId);

    const addressData = new CreateAddressDto();
    Object.assign(addressData, dto);

    const address = this.addressService.create(addressData);

    Object.assign(organization, {
      owner: owner,
      name: dto.name,
      phonenumber: dto.phone,
      ein: dto.ein,
      address: address,
    });

    return this.organizationRepository.save(organization);
  }

  async findAll() {
    return this.organizationRepository.find();
  }

  async findOne(id: number) {
    return this.organizationRepository.findOneBy({ id: id });
  }

  async findByIdOrThrow(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<Organization, 'id'>>;
      relations: string[] | FindOptionsRelations<Organization>;
    }> = {},
  ) {
    const { where = {}, relations } = options;

    const organization = await this.organizationRepository.findOne({
      where: {
        ...where,
        id,
      },
      relations: relations as string[],
    });

    if (organization) {
      return organization;
    } else {
      throw new NotFoundException('Organization not found.');
    }
  }
}
