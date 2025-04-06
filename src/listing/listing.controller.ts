import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { Listing } from './listing.entity';
import { ListingService } from './listing.service';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { GetOrdersDto } from '../order/dto/get-orders-dto';
import { OrderService } from '../order/order.service';

@Controller('listing')
export class ListingController {
  constructor(
    private readonly listingService: ListingService,
    private readonly orderService: OrderService,
  ) {}

  @Post('/')
  create(): Promise<Listing> {
    return this.listingService.create();
  }

  @Get('/')
  findAll(): Promise<Listing[]> {
    return this.listingService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Listing | null> {
    return this.listingService.findOne(id);
  }

  @Get('/:listingId/orders')
  @ResponseMessage('Successfully found orders')
  @ApiOperation({ summary: 'Get orders, with pagination' })
  findOrders(
    @Query() dto: GetOrdersDto,
    @Param('listingId', ParseIntPipe) listingId: number,
  ) {
    return this.orderService.findAll(dto, { listing: listingId });
  }
}
