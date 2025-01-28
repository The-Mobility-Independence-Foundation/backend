import { Controller, Post, Get, Param } from '@nestjs/common';
import { PartService } from './part.service';
import { Part } from './part.entity';

@Controller('part')
export class PartController {
  constructor(private readonly partService: PartService) {}

  @Post()
  create(): Promise<Part> {
    return this.partService.create();
  }

  @Get()
  findAll(): Promise<Part[]> {
    return this.partService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Part | null> {
    return this.partService.findOne(id);
  }
}
