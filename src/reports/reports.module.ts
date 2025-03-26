import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Report } from './report.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
import { CommentModule } from '../comment/comment.module';
import { ListingModule } from '../listing/listing.module';
import { PostModule } from '../post/post.module';

@Module({
  imports: [TypeOrmModule.forFeature([Report]), CommonModule, UserModule, CommentModule, ListingModule, PostModule],
  providers: [ReportsService],
  controllers: [ReportsController],
  exports: [ReportsService],
})
export class ReportsModule {}
