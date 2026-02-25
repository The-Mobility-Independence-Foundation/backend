import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BookmarkService } from './bookmarks.service';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post()
  create(@Body('userId') userId: number, @Body('listingId') listingId: number) {
    return this.bookmarkService.create(userId, listingId);
  }

  @Get()
  findAll(@Query() query: CursorPaginationDto) {
    return this.bookmarkService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.bookmarkService.findByIdOrThrow(id);
  }
}
