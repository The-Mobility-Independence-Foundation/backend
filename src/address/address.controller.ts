import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

// TODO: is this needed? discuss
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(@Body() dto: CreateAddressDto) {
    return this.addressService.create(dto);
  }

  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.addressService.findByIdOrThrow(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateAddressDto) {
    return this.addressService.update(id, dto);
  }
}
