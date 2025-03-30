import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseStrategy } from '../common/resource-access/decorators/resource-access.decorator';
import { ResourceAccessStrategyToken } from '../common/resource-access/interfaces/strategy-provider.interface';
import { CreateOrderDto } from './dto/create-order-dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ResponseMessage('Successfully created order')
  @ApiOperation({ summary: 'Create an order' })
  @UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER)
  create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.orderService.findOne(id);
  }
}
