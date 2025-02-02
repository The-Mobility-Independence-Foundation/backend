import { Controller, Post, Get, Param } from '@nestjs/common';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(): Promise<Comment> {
    return this.commentService.create();
  }

  @Get()
  findAll(): Promise<Comment[]> {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Comment | null> {
    return this.commentService.findOne(id);
  }
}
