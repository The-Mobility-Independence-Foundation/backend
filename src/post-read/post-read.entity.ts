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
export class PostRead {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.postsRead)
  @JoinColumn({ name: 'userID' })
  user: User;

  @ManyToOne(() => Post, (post) => post.readPosts)
  @JoinColumn({ name: 'postID' })
  post: Post;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateRead: Date;
}
