import { Injectable } from '@nestjs/common';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Listing } from '../listing/listing.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Listing)
    private listingRepository: Repository<Listing>,
  ) {}

  async create() {
    const order = new Order();

    const recipient = await this.userRepository.findOneBy({ id: 1 });
    const owner = await this.userRepository.findOneBy({ id: 2 });
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
