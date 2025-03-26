import { Controller, Post, Get, Param, Patch, Body } from '@nestjs/common';
import { Manufacturer } from '../model.entity';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { ManufacturerService } from './manufacturer.service';

@Controller('manufacturer')
export class ManufacturerController {
  constructor(private readonly manufacturerService: ManufacturerService) {}

  @Post()
  create(): Promise<Manufacturer> {
    return this.manufacturerService.create();
  }

  @Get()
  findAll(): Promise<Manufacturer[]> {
    return this.manufacturerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Manufacturer | null> {
    return this.manufacturerService.findByIdOrThrow(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateManufacturerDto) {
    return this.manufacturerService.update(id, dto);
  }
}
