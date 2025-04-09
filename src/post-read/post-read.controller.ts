import { Controller, Get, Param, Post } from '@nestjs/common';
import { PostRead } from './post-read.entity';
import { PostReadService } from './post-read.service';

@Controller('post-read')
export class PostReadController {
  constructor(private postreadService: PostReadService) {}

  @Post()
  create(): Promise<PostRead> {
    return this.postreadService.create();
  }

  @Get()
  findAll(): Promise<PostRead[]> {
    return this.postreadService.findAll();
  }

  @Get(':id')
  findOneBy(@Param('id') id: number): Promise<PostRead | null> {
    return this.postreadService.findOne(id);
  }
}
