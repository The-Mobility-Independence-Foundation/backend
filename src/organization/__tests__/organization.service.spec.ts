import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from '../organization.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Organization } from '../organization.entity';
import { createMock } from '@golevelup/ts-jest';
import { AddressService } from '../../address/address.service';
import { UserService } from '../../user/user.service';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
// import { PaginationService } from '../../common/services/pagination.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { when } from 'jest-when';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { Address } from '../../address/address.entity';
import { CreateAddressDto } from '../../address/dto/create-address.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { UpdateAddressDto } from '../../address/dto/update-address.dto';

describe('OrganizationService', () => {
  let service: OrganizationService;
  let userService: UserService;
  let addressService: AddressService;
  // let paginationService: PaginationService;
  let organizationRepository: Repository<Organization>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationService,
        {
          provide: getRepositoryToken(Organization),
          useValue: createMock<Repository<Organization>>(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: createMock<Repository<User>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(OrganizationService);
    userService = module.get(UserService);
    addressService = module.get(AddressService);
    // paginationService = module.get(PaginationService);
    organizationRepository = module.get(getRepositoryToken(Organization));
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an organization when dto is specified', async () => {
      const user = new User();
      const address = new Address();
      const dto = new CreateOrganizationDto();
      const addressDto = new CreateAddressDto();
      Object.assign(addressDto, {
        addressLine1: 'address 1',
        city: 'city',
        state: 'state',
        zipCode: '12345',
      });
      Object.assign(dto, {
        ownerId: 1,
        name: 'name',
        phone: '123-456-7890',
        ein: '12-3456789',
      });
      Object.assign(dto, addressDto);
      Object.assign(user, {
        id: 1,
      });

      when(userService.findById).calledWith(user.id).mockResolvedValue(user);
      when(addressService.create)
        .calledWith(addressDto)
        .mockResolvedValue(address);

      const result = await service.create(dto);

      expect(result).toBeDefined();
      expect(organizationRepository.save).toHaveBeenCalled();
    });

    it('should throw an exception if the owner already has an organization', async () => {
      const user = new User();
      const org = new Organization();
      const dto = new CreateOrganizationDto();
      Object.assign(dto, {
        ownerId: 1,
        name: 'name',
        phone: '123-456-7890',
        ein: '12-3456789',
        addressLine1: 'address 1',
        city: 'city',
        state: 'state',
        zipCode: '12345',
      });
      Object.assign(user, {
        id: 1,
        organization: org,
      });

      when(userService.findById).calledWith(user.id).mockResolvedValue(user);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return the organizations when they are found', async () => {});

    it('should throw an error when services search is used', async () => {});

    it('should throw an error when location search is used', async () => {});
  });

  describe('findByIdOrThrow', () => {
    it('should throw an error if it doesnt exist', async () => {
      const bad_id = 999999999;

      when(organizationRepository.findOne)
        .calledWith({ where: { id: bad_id } })
        .mockResolvedValue(null);

      await expect(service.findByIdOrThrow(bad_id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return the organization if it exists', async () => {
      const organization = new Organization();
      Object.assign(organization, {
        id: 1,
      });

      when(organizationRepository.findOne)
        .calledWith({ where: { id: organization.id } })
        .mockResolvedValue(organization);

      const result = await service.findByIdOrThrow(organization.id);
      expect(result).toBeDefined();
      expect(result).toBe(organization);
    });
  });

  describe('update', () => {
    it('should update when dto is valid', async () => {
      const user = new User();
      const address = new Address();
      const organization = new Organization();
      const dto = new UpdateOrganizationDto();
      const addressDto = new UpdateAddressDto();
      Object.assign(addressDto, {
        addressLine1: 'address 1',
        city: 'city',
        state: 'state',
        zipCode: '12345',
      });
      Object.assign(dto, {
        ownerId: 1,
        name: 'name',
        phone: '123-456-7890',
      });
      Object.assign(dto, addressDto);
      Object.assign(user, {
        id: 1,
      });
      Object.assign(address, {
        id: 1,
      });
      Object.assign(organization, {
        id: 1,
        address: address,
      });

      when(userService.findById).calledWith(user.id).mockResolvedValue(user);
      when(addressService.update)
        .calledWith(address.id, addressDto)
        .mockResolvedValue(address);
      when(organizationRepository.findOne)
        .calledWith(expect.anything())
        .mockResolvedValue(organization);

      const result = await service.update(organization.id, dto);

      expect(result).toBeDefined();
      expect(organizationRepository.save).toHaveBeenCalled();
    });
  });

  describe('addUser', () => {
    it('should add the user to the organization', async () => {
      const user = new User();
      const organization = new Organization();
      Object.assign(user, {
        id: 1,
      });
      Object.assign(organization, {
        id: 1,
      });

      when(userService.findById).calledWith(user.id).mockResolvedValue(user);
      when(organizationRepository.findOne)
        .calledWith(expect.anything())
        .mockResolvedValue(organization);

      const result = await service.addUser(organization.id, user.id);

      expect(result).toBeDefined();
      expect(userRepository.save).toHaveBeenCalled();
    });
  });

  describe('getUsers', () => {
    it('should get all of the users in the organization', async () => {
      const user = new User();
      const organization = new Organization();
      Object.assign(user, {
        id: 1,
      });
      Object.assign(organization, {
        id: 1,
      });

      when(userRepository.find)
        .calledWith({ where: { organization: { id: organization.id } } })
        .mockResolvedValue([user]);

      const result = await service.getUsers(organization.id);

      expect(result).toBeDefined();
    });
  });
});
