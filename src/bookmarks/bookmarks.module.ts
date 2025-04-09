import { forwardRef, Module } from '@nestjs/common';
import { BookmarkService } from './bookmarks.service';
import { Bookmark } from './bookmarks.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ListingModule } from '../listing/listing.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bookmark]),
    forwardRef(() => UserModule),
    ListingModule,
    CommonModule,
  ],
  providers: [BookmarkService],
  controllers: [],
  exports: [BookmarkService],
})
export class BookmarkModule {}
