import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Forum } from '../forum/forum.entity';
import { Prefix } from '../prefix/prefix.entity';
import { User } from '../user/entities/user.entity';
import { PostController } from './post.controller';
import { Post } from './post.entity';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Forum, Prefix])],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
