import { Injectable } from '@nestjs/common';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderService {

    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
    ) {}

    async create() {
        const order = new Order();
        order.listingID = 1;
        order.owner = 1;
        order.recipient = 1;
        order.quantity = 1;

        return this.orderRepository.save(order);
    }

    async findAll() {
        
        return this.orderRepository.find();
        
    }

    async findOne(id: number) {

        return this.orderRepository.findOneBy({orderID: id});

    }

}
