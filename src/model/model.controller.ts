import { Controller, Post, Get, Param } from '@nestjs/common';
import { ModelService } from './model.service';
import { Model } from './model.entity';

@Controller('model')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Post()
  create(): Promise<Model> {
    return this.modelService.create();
  }

  @Get()
  findAll(): Promise<Model[]> {
    return this.modelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Model | null> {
    return this.modelService.findOne(id);
  }
}
