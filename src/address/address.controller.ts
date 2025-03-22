import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly commentService: AddressService) {}

  @Post()
  create(@Body() dto: CreateAddressDto) {
    return this.commentService.create(dto);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.commentService.findByIdOrThrow(id);
  }
}
