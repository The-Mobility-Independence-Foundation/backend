import { Injectable } from '@nestjs/common';
import { PostSubscription } from './post-subscription.entity';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostSubscriptionService {
    constructor(
        @InjectRepository(PostSubscription)
        private postsubscriptionRepository: Repository<PostSubscription>,
    
        @InjectRepository(Post)
        private postRepository: Repository<Post>,

        @InjectRepository(User)
        private userRepository: Repository<User>,
      ) {}

      async create() {
        const subscription = new PostSubscription();
    
        const post = await this.postRepository.findOneBy({ id: 1 });
        const user = await this.userRepository.findOneBy({id: 1});

        if (post) {
          subscription.post = post;
        }

        if (user) {
            subscription.subscriber = user;
        }

    
        return this.postsubscriptionRepository.save(subscription);
      }

      async findAll() {
        return this.postsubscriptionRepository.find();
      }
    
      async findOne(id: number) {
        return this.postsubscriptionRepository.findOneBy({ id: id });
      }
}
