import { Injectable } from '@nestjs/common';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Organization } from 'src/organization/organization.entity';
import { Listing } from 'src/listing/listing.entity';

@Injectable()
export class OrderService {

    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,

        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Organization)
        private organizationRepository: Repository<Organization>,

        @InjectRepository(Listing)
        private listingRepository: Repository<Listing>,
    ) {}

    async create() {
        const order = new Order();

        const recipient = await this.userRepository.findOneBy({ id: 1 });
        const owner = await this.organizationRepository.findOneBy({ id: 1 });
        const listing = await this.listingRepository.findOneBy({ id: 1 });
        if (recipient && owner && listing) {
            order.listing = listing;
            order.owner = owner;
            order.recipient = recipient;
            order.quantity = 1;
        }

        return this.orderRepository.save(order);
    }

    async findAll() {
        
        return this.orderRepository.find();
        
    }

    async findOne(id: number) {

        return this.orderRepository.findOneBy({id: id});

    }

}
