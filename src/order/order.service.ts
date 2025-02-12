import { Injectable } from '@nestjs/common';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Listing } from '../listing/listing.entity';
import { Organization } from '../organization/organization.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,

    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async create() {
    const order = new Order();

    const recipient = await this.userRepository.findOneBy({ id: 1 });
    const recipientOrganization = await this.organizationRepository.findOneBy({
      id: 2,
    });
    const owner = await this.userRepository.findOneBy({ id: 2 });
    const ownerOrganization = await this.organizationRepository.findOneBy({
      id: 1,
    });
    const listing = await this.listingRepository.findOneBy({ id: 1 });

    if (listing) {
      order.listing = listing;
    }
    if (owner) {
      order.owner = owner;
    }
    if (recipient) {
      order.recipient = recipient;
    }
    if (recipientOrganization) {
      order.recipientOrganization = recipientOrganization;
    }
    if (ownerOrganization) {
      order.ownerOrganization = ownerOrganization;
    }

    order.addressLine1 = '1789 State Highway 8';
    order.city = 'Mount Upton';
    order.state = 'New York';
    order.zipcode = '13809';

    order.quantity = 1;

    return this.orderRepository.save(order);
  }

  async findAll() {
    return this.orderRepository.find();
  }

  async findOne(id: number) {
    return this.orderRepository.findOneBy({ id: id });
  }
}
