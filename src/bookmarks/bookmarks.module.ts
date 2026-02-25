import { forwardRef, Module } from '@nestjs/common';
import { BookmarkService } from './bookmarks.service';
import { BookmarkController } from './bookmarks.controller';
import { Bookmark } from './bookmarks.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ListingsModule } from '../listings/listings.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bookmark]),
    forwardRef(() => UserModule),
    ListingsModule,
    CommonModule,
  ],
  providers: [BookmarkService],
  controllers: [BookmarkController],
  exports: [BookmarkService],
})
export class BookmarkModule {}
