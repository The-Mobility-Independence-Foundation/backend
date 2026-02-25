import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from './comment.entity';
import { Post } from '../post/post.entity';
import { User } from '../user/entities/user.entity';
import { Forum } from '../forum/forum.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Post, Forum])],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
