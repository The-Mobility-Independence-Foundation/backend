import { Controller, Get, Param, Post } from '@nestjs/common';
import { PostSubscription } from './post-subscription.entity';
import { PostSubscriptionService } from './post-subscription.service';

@Controller('post-subscription')
export class PostSubscriptionController {
  constructor(private postsubscriptionService: PostSubscriptionService) {}

  @Post()
  create(): Promise<PostSubscription> {
    return this.postsubscriptionService.create();
  }

  @Get()
  findAll(): Promise<PostSubscription[]> {
    return this.postsubscriptionService.findAll();
  }

  @Get(':id')
  findOneBy(@Param('id') id: number): Promise<PostSubscription | null> {
    return this.postsubscriptionService.findOne(id);
  }
}
