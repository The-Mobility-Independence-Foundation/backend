import { Controller, Post, Get, Param } from '@nestjs/common';
import { Order } from './order.entity';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {

    constructor(private orderService: OrderService) {}
    
    @Post()
    create(): Promise<Order> {
        return this.orderService.create();
    }

    @Get()
    findAll(): Promise<Order[]> {
        return this.orderService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Order | null> {
        return this.orderService.findOne(id);
    }

}
