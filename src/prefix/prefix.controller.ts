import { Controller, Get, Param, Post } from '@nestjs/common';
import { Prefix } from './prefix.entity';
import { PrefixService } from './prefix.service';

@Controller('prefix')
export class PrefixController {
  constructor(private PrefixService: PrefixService) {}

  @Post()
  create(): Promise<Prefix> {
    return this.PrefixService.create();
  }

  @Get()
  findAll(): Promise<Prefix[]> {
    return this.PrefixService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Prefix | null> {
    return this.PrefixService.findOne(id);
  }
}
