import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Report } from './report.entity';
import { Post as PostEntity } from '../post/post.entity';
import { Listing } from '../listing/listing.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Comment } from '../comment/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, User, PostEntity, Listing, Comment]),
  ],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
