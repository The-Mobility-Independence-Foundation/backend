import { Controller, Post, Get, Param } from '@nestjs/common';
import { Bookmark } from './bookmark.entity';
import { BookmarkService } from './bookmark.service';

@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post()
  create(): Promise<Bookmark> {
    return this.bookmarkService.create();
  }

  @Get()
  findAll(): Promise<Bookmark[]> {
    return this.bookmarkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Bookmark | null> {
    return this.bookmarkService.findOne(id);
  }
}
