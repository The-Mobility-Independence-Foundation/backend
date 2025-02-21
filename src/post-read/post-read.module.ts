import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Post } from '../post/post.entity';
import { PostReadController } from './post-read.controller';
import { PostRead } from './post-read.entity';
import { PostReadService } from './post-read.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostRead, User, Post])],
  controllers: [PostReadController],
  providers: [PostReadService],
})
export class PostReadModule {}
