import { Injectable } from '@nestjs/common';
import { Order, OrderStatus } from './order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { OrganizationService } from '../organization/organization.service';
import { ListingService } from '../listing/listing.service';
import { CreateOrderDto } from './dto/create-order-dto';
import { CreateAddressDto } from '../address/dto/create-address.dto';
import { AddressService } from '../address/address.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    private readonly userService: UserService,
    private readonly listingService: ListingService,
    private readonly organizationService: OrganizationService,
    private readonly addressService: AddressService,
  ) {}

  async create(dto: CreateOrderDto) {
    const order = new Order();
    const listing = await this.listingService.findByIdOrThrow(dto.listingId, {
      relations: { owner: true },
    });
    const recipient = await this.userService.findByIdOrThrow(dto.recipientId, {
      relations: { organization: true },
    });

    const addressData = new CreateAddressDto();
    Object.assign(addressData, {
      addressLine1: dto.addressLine1,
      addressLine2: dto.addressLine2,
      city: dto.city,
      state: dto.state,
      zipCode: dto.zipCode,
    });
    const address = await this.addressService.create(addressData);

    Object.assign(order, {
      listing: listing,
      providerOrganization: listing.owner,
      recipient: recipient,
      recipientOrganization: recipient.organization,
      quantity: dto.quantity,
      status: OrderStatus.PENDING,
      dateCreated: new Date(),
      address: address,
    });

    return this.orderRepository.save(order);
  }

  async findAll() {
    return this.orderRepository.find();
  }

  async findOne(id: number) {
    return this.orderRepository.findOneBy({ id: id });
  }
}
