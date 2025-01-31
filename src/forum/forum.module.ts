import { Module } from '@nestjs/common';
import { ForumController } from './forum.controller';
import { ForumService } from './forum.service';
import { Forum } from './forum.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Forum])],
  controllers: [ForumController],
  providers: [ForumService],
})
export class ForumModule {}
