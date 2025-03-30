import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Order, OrderStatus } from './order.entity';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { OrganizationService } from '../organization/organization.service';
import { ListingService } from '../listing/listing.service';
import { CreateOrderDto } from './dto/create-order-dto';
import { CreateAddressDto } from '../address/dto/create-address.dto';
import { AddressService } from '../address/address.service';
import { UpdateOrderDto } from './dto/update-order-dto';
import { UpdateAddressDto } from '../address/dto/update-address.dto';

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
      status: OrderStatus.INITIATED,
      dateCreated: new Date(),
      address: address,
    });

    return this.orderRepository.save(order);
  }

  async findAll() {
    return this.orderRepository.find();
  }

  async findByIdOrThrow(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<Order, 'id'>>;
      relations: string[] | FindOptionsRelations<Order>;
    }> = {},
  ) {
    const { where = {}, relations } = options;

    const order = await this.orderRepository.findOne({
      where: {
        ...where,
        id,
      },
      relations: relations as string[],
    });

    if (order) {
      return order;
    } else {
      throw new NotFoundException('Order not found.');
    }
  }

  async update(id: number, dto: UpdateOrderDto) {
    const order = await this.findByIdOrThrow(id, {
      relations: { address: true, recipientOrganization: true },
    });

    if (dto.providerId) {
      const user = await this.userService.findByIdOrThrow(dto.providerId, {
        relations: { organization: true },
      });
      if (user.organization?.id === order.recipientOrganization.id) {
        order.provider = user;
      } else {
        throw new BadRequestException(
          'Order cannot be handled by someone from a different organization.',
        );
      }
    }

    if (dto.status) {
      order.status = dto.status;
      if (
        dto.status === OrderStatus.FULFILLED ||
        dto.status === OrderStatus.VOIDED
      ) {
        order.dateCompleted = new Date();
      }
    }

    if (
      dto.addressLine1 ||
      dto.addressLine2 ||
      dto.city ||
      dto.state ||
      dto.zipCode
    ) {
      const addressData = new UpdateAddressDto();
      Object.assign(addressData, {
        addressLine1: dto.addressLine1,
        addressLine2: dto.addressLine2,
        city: dto.city,
        state: dto.state,
        zipCode: dto.zipCode,
      });
      await this.addressService.update(order.address.id, addressData);
    }

    return this.orderRepository.save(order);
  }
}
