import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { Organization } from './organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UserService } from '../user/user.service';
import { CreateAddressDto } from '../address/dto/create-address.dto';
import { AddressService } from '../address/address.service';
import { GetOrganizationsDto } from './dto/get-organizations.dto';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { PaginationService } from '../common/services/pagination.service';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,

    private readonly userService: UserService,
    private readonly addressService: AddressService,
    private readonly paginationService: PaginationService,
  ) {}

  // TODO: return an actual error message when someone tries to own two organizations
  // if not here then add a decorator somewhere maybe?
  async create(dto: CreateOrganizationDto) {
    const organization = new Organization();
    const owner = await this.userService.findById(dto.ownerId); // TODO: update when reports-api merged in

    const addressData = new CreateAddressDto();
    Object.assign(addressData, {
      addressLine1: dto.addressLine1,
      addressLine2: dto.addressLine2,
      city: dto.city,
      state: dto.state,
      zipCode: dto.zipCode,
    });

    const address = await this.addressService.create(addressData);

    Object.assign(organization, {
      owner: owner,
      name: dto.name,
      phonenumber: dto.phone,
      ein: dto.ein,
      address: address,
    });

    return this.organizationRepository.save(organization);
  }

  async findAll(query: GetOrganizationsDto) {
    const findWhere: any = {};
    const paginationDto = new CursorPaginationDto();

    Object.assign(findWhere, {
      name: query.name,
      inactive: !query.active,
    });

    if (query.radius) {
      throw new NotImplementedException(
        'Radius search is not implemented yet.',
      );
    }

    if (query.services) {
      throw new NotImplementedException(
        'Services search is not implemented yet.',
      );
    }

    Object.assign(paginationDto, {
      cursor: query.cursor,
      limit: query.limit,
      direction: query.direction,
    });

    return this.paginationService.paginateWithCursor(
      this.organizationRepository,
      paginationDto,
      {
        cursorColumn: 'id',
        where: findWhere,
      },
    );
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

  async update(id: number, dto: UpdateOrganizationDto) {
    const organization = await this.findByIdOrThrow(id);
    // const address = organization.address;

    if (
      dto.addressLine1 ||
      dto.addressLine2 ||
      dto.city ||
      dto.zipCode ||
      dto.state
    ) {
      throw new NotImplementedException('Address update not implemented');
    }

    if (dto.ownerId) {
      organization.owner = await this.userService.findById(dto.ownerId); // TODO: update when reports merged in
    }

    Object.assign(organization, {
      name: dto.name,
      phoneNumber: dto.phonenumber,
      services: dto.services,
      socials: dto.socials,
    });

    return await this.organizationRepository.save(organization);
  }
}
