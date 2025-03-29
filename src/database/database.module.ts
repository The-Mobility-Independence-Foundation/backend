import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { InventoryModule } from '../inventory/inventory.module';
import { UserModule } from '../user/user.module';
import { OrganizationModule } from '../organization/organization.module';
import { InviteModule } from '../invite/invite.module';
import { RequestModule } from '../request/request.module';
import { ReviewModule } from '../review/review.module';
import { ConversationModule } from '../conversation/conversation.module';
import { MessageModule } from '../message/message.module';
import { ListingModule } from '../listing/listing.module';
import { OrderModule } from '../order/order.module';
import { InventoryItemModule } from '../inventory-item/inventory-item.module';
import { TagModule } from '../tag/tag.module';
import { PartModule } from '../part/part.module';
import { ModelModule } from '../model/model.module';
import { WordfilterModule } from '../wordfilter/wordfilter.module';
import { ForumModule } from '../forum/forum.module';
import { PrefixModule } from '../prefix/prefix.module';
import { PostModule } from '../post/post.module';
import { CommentModule } from '../comment/comment.module';
import { PostSubscriptionModule } from '../post-subscription/post-subscription.module';
import { PostReadModule } from '../post-read/post-read.module';
import { ReportsModule } from '../reports/reports.module';
import { AttachmentsModule } from '../attachments/attachments.module';
import { ConnectionsModule } from '../connections/connections.module';
import { AddressModule } from '../address/address.module';
import { ManufacturerModule } from '../manufacturer/manufacturer.module';
import { ModelTypeModule } from '../model-type/model-type.module';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    InventoryModule,
    UserModule,
    OrganizationModule,
    InviteModule,
    RequestModule,
    ReviewModule,
    ConversationModule,
    MessageModule,
    ListingModule,
    OrderModule,
    InventoryItemModule,
    TagModule,
    PartModule,
    ModelModule,
    WordfilterModule,
    ForumModule,
    PrefixModule,
    PostModule,
    CommentModule,
    PostSubscriptionModule,
    PostReadModule,
    ReportsModule,
    AttachmentsModule,
    ConnectionsModule,
    AddressModule,
    ManufacturerModule,
    ModelTypeModule,
  ],
})
export class DatabaseModule {}
