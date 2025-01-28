import { Controller, Post, Get, Param } from '@nestjs/common';
import { Review } from './review.entity';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post()
  create(): Promise<Review> {
    return this.reviewService.create();
  }

  @Get()
  findAll(): Promise<Review[]> {
    return this.reviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Review | null> {
    return this.reviewService.findOne(id);
  }
}
