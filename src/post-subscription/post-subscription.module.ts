import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../post/post.entity';
import { User } from '../user/user.entity';
import { PostSubscriptionController } from './post-subscription.controller';
import { PostSubscription } from './post-subscription.entity';
import { PostSubscriptionService } from './post-subscription.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostSubscription, User, Post])],
  controllers: [PostSubscriptionController],
  providers: [PostSubscriptionService]
})
export class PostSubscriptionModule {}
