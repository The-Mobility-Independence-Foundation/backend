import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsWhere,
  IsNull,
  Repository,
} from 'typeorm';
import { Organization } from './organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UserService } from '../user/user.service';
import { CreateAddressDto } from '../address/dto/create-address.dto';
import { AddressService } from '../address/address.service';
import { GetOrganizationsDto } from './dto/get-organizations.dto';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { PaginationService } from '../common/services/pagination.service';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { UpdateAddressDto } from '../address/dto/update-address.dto';
import { User } from '../user/entities/user.entity';
import { Order } from '../order/order.entity';
import { DEFAULT_ORDER_RELATIONS } from '../order/order.constants';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    private readonly userService: UserService,
    private readonly addressService: AddressService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(dto: CreateOrganizationDto) {
    const organization = new Organization();
    const owner = await this.userService.findByIdOrThrow(dto.ownerId);

    if (owner.organization) {
      throw new BadRequestException('This user already has an organization.');
    }

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
    const organization = await this.findByIdOrThrow(id, {
      relations: { address: true },
    });
    const address = organization.address;
    const addressDto = new UpdateAddressDto();

    Object.assign(addressDto, {
      addressLine1: dto.addressLine1,
      addressLine2: dto.addressLine2,
      city: dto.city,
      state: dto.state,
      zipCode: dto.zipCode,
    });

    await this.addressService.update(address.id, addressDto);

    if (dto.ownerId) {
      organization.owner = await this.userService.findByIdOrThrow(dto.ownerId);
      this.addUser(id, dto.ownerId);
    }

    Object.assign(organization, {
      name: dto.name,
      phoneNumber: dto.phonenumber,
      services: dto.services,
      socials: dto.socials,
    });

    return this.organizationRepository.save(organization);
  }

  /**
   * Add a user to an organization
   * @param orgId - The id of the org to add to
   * @param userId - The id of the user to add to
   * @returns The updated user record
   */
  async addUser(orgId: number, userId: number) {
    const organization = await this.findByIdOrThrow(orgId);
    const user = await this.userService.findByIdOrThrow(userId);

    user.organization = organization;

    return this.userRepository.save(user);
  }

  /**
   * Gets all users in a specified organization, without pagination
   * @param id - The id of the organization to search
   * @returns An array of user records
   */
  async getUsers(id: number) {
    const users = await this.userRepository.find({
      where: {
        organization: { id: id },
      },
    });

    return users;
  }

  async getOrderPool(id: number) {
    const org = await this.findByIdOrThrow(id);
    const { relations: relations } = DEFAULT_ORDER_RELATIONS;

    const pool = await this.orderRepository.find({
      where: {
        providerOrganization: org,
        provider: IsNull(),
      },
      relations: relations,
      order: {
        dateCreated: 'DESC',
      },
    });

    return pool;
  }
}
