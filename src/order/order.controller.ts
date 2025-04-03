import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseStrategy } from '../common/resource-access/decorators/resource-access.decorator';
import { ResourceAccessStrategyToken } from '../common/resource-access/interfaces/strategy-provider.interface';
import { CreateOrderDto } from './dto/create-order-dto';
import { UpdateOrderDto } from './dto/update-order-dto';
import { GetOrdersDto } from './dto/get-orders-dto';
import { DEFAULT_ORDER_RELATIONS } from './order.constants';

@ApiTags('orders')
@Controller('orders')
@UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ResponseMessage('Successfully created order')
  @ApiOperation({ summary: 'Create an order' })
  create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Get()
  @ResponseMessage('Successfully found orders')
  @ApiOperation({ summary: 'Get orders, with pagination' })
  @UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER, { adminOnly: true })
  findAll(@Query() dto: GetOrdersDto) {
    return this.orderService.findAll(dto);
  }

  @Get(':orderId')
  @ResponseMessage('Successfully found order')
  @ApiOperation({ summary: 'Get information about an order' })
  @UseStrategy(ResourceAccessStrategyToken.ORDER)
  findOne(@Param('orderId') id: number) {
    return this.orderService.findByIdOrThrow(id, DEFAULT_ORDER_RELATIONS);
  }

  @Patch(`:orderId`)
  @ResponseMessage('Successfully updated order')
  @ApiOperation({ summary: 'Update an order' })
  @UseStrategy(ResourceAccessStrategyToken.ORDER)
  update(@Param('orderId') orderId: number, @Body() dto: UpdateOrderDto) {
    return this.orderService.update(orderId, dto);
  }
}
