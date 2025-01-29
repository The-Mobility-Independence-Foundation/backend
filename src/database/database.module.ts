import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InventoryModule } from '../inventory/inventory.module';
import { UserModule } from '../user/user.module';
import { OrganizationModule } from '../organization/organization.module';
import { InviteModule } from '../invite/invite.module';
import { RequestModule } from '../request/request.module';
import { ReviewModule } from '../review/review.module';
import { ConversationModule } from '../conversation/conversation.module';
import { MessageModule } from '../conversation/message/message.module';
import { BookmarkModule } from '../bookmark/bookmark.module';
import { ListingModule } from '../listing/listing.module';
import { OrderModule } from '../order/order.module';
import { InventoryItemModule } from '../inventory/inventory-item/inventory-item.module';
import { WordfilterModule } from '../wordfilter/wordfilter.module';
import { ForumModule } from '../forum/forum.module';
import { PrefixModule } from '../prefix/prefix.module';




// When we set up the actual DB, we need to change this to read values from a file.
// That way, we aren't leaking db credentials on our public git repo.
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'postgres',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true, // This needs to be disabled when we set up the real repo and be replaced with migrations!
    }),
    InventoryModule,
    UserModule,
    OrganizationModule,
    InviteModule,
    RequestModule,
    ReviewModule,
    ConversationModule,
    MessageModule,
    BookmarkModule,
    ListingModule,
    OrderModule,
    InventoryItemModule,
    WordfilterModule,
    ForumModule,
    PrefixModule
    ],
})
export class DatabaseModule {}
