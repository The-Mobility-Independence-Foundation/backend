import { Controller, Post, Get, Param } from '@nestjs/common';
import { WordfilterService } from './wordfilter.service';
import { Wordfilter } from './wordfilter.entity';

@Controller('wordfilter')
export class WordfilterController {
  constructor(private WordfilterService: WordfilterService) {}

  @Post()
  create(): Promise<Wordfilter> {
    return this.WordfilterService.create();
  }

  @Get()
  findAll(): Promise<Wordfilter[]> {
    return this.WordfilterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Wordfilter | null> {
    return this.WordfilterService.findOne(id);
  }
}
