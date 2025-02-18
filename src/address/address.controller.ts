import { Controller, Get, Param, Post } from '@nestjs/common';
import { Address } from './address.entity';
import { AddressService } from './address.service';

@Controller('address')
export class AddressController {
  constructor(private readonly commentService: AddressService) {}
    
    @Post()
    create(): Promise<Address> {
      return this.commentService.create();
    }
  
    @Get()
    findAll(): Promise<Address[]> {
      return this.commentService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: number): Promise<Address | null> {
      return this.commentService.findOne(id);
    }
}
