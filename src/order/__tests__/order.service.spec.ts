import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order, OrderStatus } from '../order.entity';
import { User } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { AddressService } from '../../address/address.service';
import { UserService } from '../../user/user.service';
import { ListingsService } from '../../listings/listings.service';
import { Organization } from '../../organization/organization.entity';
import { Listing } from '../../listings/listing.entity';
import { CreateOrderDto } from '../dto/create-order-dto';
import { when } from 'jest-when';
import { Address } from '../../address/address.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateOrderDto } from '../dto/update-order-dto';
import { GetOrdersDto } from '../dto/get-orders-dto';
import { PaginationService } from '../../common/services/pagination.service';
import { BaseApiCursorPaginationResponse } from '../../common/responses/base-api-cursor-pagination.response';

describe('OrderService', () => {
  let service: OrderService;
  let userService: UserService;
  let addressService: AddressService;
  let listingsService: ListingsService;
  let paginationService: PaginationService;
  let repository: Repository<Order>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: createMock<Repository<Order>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(OrderService);
    userService = module.get(UserService);
    addressService = module.get(AddressService);
    listingsService = module.get(ListingsService);
    paginationService = module.get(PaginationService);
    repository = module.get(getRepositoryToken(Order));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order when given the correct information', async () => {
      const order = new Order();

      const owner = new Organization();
      Object.assign(owner, {
        id: 1,
      });

      const recipientOrg = new Organization();
      Object.assign(recipientOrg, {
        id: 2,
      });

      const listing = new Listing();
      Object.assign(listing, {
        id: 1,
        owner: owner,
      });

      const recipient = new User();
      Object.assign(recipient, {
        id: 1,
        organization: recipientOrg,
      });

      const address = new Address();
      Object.assign(address, {
        id: 1,
        addressLine1: 'line 1',
        city: 'cityland',
        state: 'stateville',
        zipCode: '12345-6789',
      });

      const dto = new CreateOrderDto();
      Object.assign(dto, {
        listingId: listing.id,
        recipientId: recipient.id,
        quantity: 10,
        addressLine1: address.addressLine1,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
      });

      when(listingsService.findByIdOrThrow)
        .calledWith(listing.id, expect.anything())
        .mockResolvedValue(listing);
      when(userService.findByIdOrThrow)
        .calledWith(recipient.id, expect.anything())
        .mockResolvedValue(recipient);
      when(addressService.create)
        .calledWith(expect.anything())
        .mockResolvedValue(address);

      when(repository.save)
        .calledWith(expect.anything())
        .mockResolvedValue(order);

      const result = await service.create(dto);

      expect(result).toBeDefined();
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findByIdOrThrow', () => {
    it('should throw an error when given a bad id', async () => {
      const bad_id = 999999999;

      when(repository.findOne)
        .calledWith({ where: { id: bad_id } })
        .mockResolvedValue(null);

      await expect(service.findByIdOrThrow(bad_id)).rejects.toThrow(
        new NotFoundException('Order not found.'),
      );
    });

    it('should return the order when id is valid', async () => {
      const order = new Order();
      Object.assign(order, {
        id: 1,
      });

      when(repository.findOne)
        .calledWith({ where: { id: order.id } })
        .mockResolvedValue(order);

      const result = await service.findByIdOrThrow(order.id);

      expect(result).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update the date if order is fulfilled', async () => {
      const address = new Address();
      Object.assign(address, {
        id: 1,
      });

      const org = new Organization();
      Object.assign(org, {
        id: 1,
      });

      const order = new Order();
      Object.assign(order, {
        id: 1,
        address: address,
        recipientOrganization: org,
      });

      const dto = new UpdateOrderDto();
      Object.assign(dto, {
        status: OrderStatus.FULFILLED,
      });

      when(repository.findOne)
        .calledWith(expect.objectContaining({ where: { id: order.id } }))
        .mockResolvedValue(order);

      when(repository.save)
        .calledWith(expect.anything())
        .mockResolvedValue(order);

      const result = await service.update(order.id, dto);

      expect(result).toBeDefined();
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ dateCompleted: expect.anything() }),
      );
    });

    it('should update address if address data is specified', async () => {
      const address = new Address();
      Object.assign(address, {
        id: 1,
      });

      const org = new Organization();
      Object.assign(org, {
        id: 1,
      });

      const order = new Order();
      Object.assign(order, {
        id: 1,
        address: address,
        recipientOrganization: org,
      });

      const dto = new UpdateOrderDto();
      Object.assign(dto, {
        state: 'new state',
      });

      when(repository.findOne)
        .calledWith(expect.objectContaining({ where: { id: order.id } }))
        .mockResolvedValue(order);
      when(repository.save)
        .calledWith(expect.anything())
        .mockResolvedValue(order);
      when(addressService.update)
        .calledWith(address.id, expect.anything())
        .mockResolvedValue(address);

      const result = await service.update(order.id, dto);

      expect(result).toBeDefined();
      expect(addressService.update).toHaveBeenCalled();
    });

    it('should throw a BadRequestException when trying to set an invalid provider', async () => {
      const address = new Address();
      Object.assign(address, {
        id: 1,
      });

      const org = new Organization();
      Object.assign(org, {
        id: 2,
      });

      const order = new Order();
      Object.assign(order, {
        id: 3,
        address: address,
        recipientOrganization: org,
      });

      const providerOrg = new Organization();
      Object.assign(providerOrg, {
        id: 4,
      });

      const provider = new User();
      Object.assign(provider, {
        id: 5,
        organization: providerOrg,
      });

      const dto = new UpdateOrderDto();
      Object.assign(dto, {
        providerId: provider.id,
      });

      when(repository.findOne)
        .calledWith(expect.objectContaining({ where: { id: order.id } }))
        .mockResolvedValue(order);
      when(repository.save)
        .calledWith(expect.anything())
        .mockResolvedValue(order);
      when(userService.findByIdOrThrow)
        .calledWith(provider.id, expect.anything())
        .mockResolvedValue(provider);

      await expect(service.update(order.id, dto)).rejects.toThrow(
        new BadRequestException(
          'Order cannot be handled by someone from a different organization.',
        ),
      );
    });

    it('should update the provider when in the same organization', async () => {
      const address = new Address();
      Object.assign(address, {
        id: 1,
      });

      const org = new Organization();
      Object.assign(org, {
        id: 2,
      });

      const order = new Order();
      Object.assign(order, {
        id: 3,
        address: address,
        recipientOrganization: org,
      });

      const providerOrg = new Organization();
      Object.assign(providerOrg, {
        id: 4,
      });

      const provider = new User();
      Object.assign(provider, {
        id: 5,
        organization: org,
      });

      const dto = new UpdateOrderDto();
      Object.assign(dto, {
        providerId: provider.id,
      });

      when(repository.findOne)
        .calledWith(expect.objectContaining({ where: { id: order.id } }))
        .mockResolvedValue(order);
      when(repository.save)
        .calledWith(expect.anything())
        .mockResolvedValue(order);
      when(userService.findByIdOrThrow)
        .calledWith(provider.id, expect.anything())
        .mockResolvedValue(provider);

      const result = await service.update(order.id, dto);

      expect(result).toBeDefined();
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ provider: expect.anything() }),
      );
    });
  });

  describe('findAll', () => {
    it('should use LessThan when before is specified', async () => {
      const dto = new GetOrdersDto();
      Object.assign(dto, {
        limit: 10,
        direction: 'next',
        before: new Date(),
      });

      when(paginationService.paginateWithCursor)
        .calledWith(expect.anything(), expect.anything(), expect.anything())
        .mockResolvedValue(new BaseApiCursorPaginationResponse());

      service.findAll(dto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ where: { dateCreated: expect.anything() } }),
      );
    });

    it('should use MoreThan when after is specified', async () => {
      const dto = new GetOrdersDto();
      Object.assign(dto, {
        limit: 10,
        direction: 'next',
        after: new Date(),
      });

      when(paginationService.paginateWithCursor)
        .calledWith(expect.anything(), expect.anything(), expect.anything())
        .mockResolvedValue(new BaseApiCursorPaginationResponse());

      service.findAll(dto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ where: { dateCreated: expect.anything() } }),
      );
    });

    it('should use both when both are specified', async () => {
      const dto = new GetOrdersDto();
      Object.assign(dto, {
        limit: 10,
        direction: 'next',
        before: new Date(),
        after: new Date(),
      });

      when(paginationService.paginateWithCursor)
        .calledWith(expect.anything(), expect.anything(), expect.anything())
        .mockResolvedValue(new BaseApiCursorPaginationResponse());

      service.findAll(dto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ where: { dateCreated: expect.anything() } }),
      );
    });

    it('should use listing when listing is specified', async () => {
      const dto = new GetOrdersDto();
      Object.assign(dto, {
        limit: 10,
        direction: 'next',
      });

      when(paginationService.paginateWithCursor)
        .calledWith(expect.anything(), expect.anything(), expect.anything())
        .mockResolvedValue(new BaseApiCursorPaginationResponse());

      service.findAll(dto, { listing: 1 });

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ where: { listing: { id: 1 } } }),
      );
    });

    it('should use providerOrg when sentOnly is true and org is provided', async () => {
      const dto = new GetOrdersDto();
      Object.assign(dto, {
        limit: 10,
        direction: 'next',
        sentOnly: 'true',
      });

      when(paginationService.paginateWithCursor)
        .calledWith(expect.anything(), expect.anything(), expect.anything())
        .mockResolvedValue(new BaseApiCursorPaginationResponse());

      service.findAll(dto, { org: 1 });

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ where: { providerOrganization: { id: 1 } } }),
      );
    });

    it('should use recipientOrg when sentOnly is false and org is provided', async () => {
      const dto = new GetOrdersDto();
      Object.assign(dto, {
        limit: 10,
        direction: 'next',
        sentOnly: 'false',
      });

      when(paginationService.paginateWithCursor)
        .calledWith(expect.anything(), expect.anything(), expect.anything())
        .mockResolvedValue(new BaseApiCursorPaginationResponse());

      service.findAll(dto, { org: 1 });

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({
          where: { recipientOrganization: { id: 1 } },
        }),
      );
    });

    it('should use provider when sentOnly is true and user is provided', async () => {
      const dto = new GetOrdersDto();
      Object.assign(dto, {
        limit: 10,
        direction: 'next',
        sentOnly: 'true',
      });

      when(paginationService.paginateWithCursor)
        .calledWith(expect.anything(), expect.anything(), expect.anything())
        .mockResolvedValue(new BaseApiCursorPaginationResponse());

      service.findAll(dto, { user: 1 });

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ where: { provider: { id: 1 } } }),
      );
    });

    it('should use recipient when sentOnly is false and user is provided', async () => {
      const dto = new GetOrdersDto();
      Object.assign(dto, {
        limit: 10,
        direction: 'next',
        sentOnly: 'false',
      });

      when(paginationService.paginateWithCursor)
        .calledWith(expect.anything(), expect.anything(), expect.anything())
        .mockResolvedValue(new BaseApiCursorPaginationResponse());

      service.findAll(dto, { user: 1 });

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ where: { recipient: { id: 1 } } }),
      );
    });
  });
});
