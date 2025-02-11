import { Post } from '../post/post.entity';
import { User } from '../user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class PostSubscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.subscriptions)
  @JoinColumn({ name: 'userID' })
  subscriber: User;

  @ManyToOne(() => Post, (post) => post.subscriptions)
  @JoinColumn({ name: 'postID' })
  post: Post;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  whenSubscribed: Date;
}
