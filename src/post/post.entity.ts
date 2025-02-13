import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Prefix } from '../prefix/prefix.entity';
import { User } from '../user/user.entity';
import { Forum } from '../forum/forum.entity';
import { Comment } from '../comment/comment.entity';
import { PostSubscription } from '../post-subscription/post-subscription.entity';
import { PostRead } from '../post-read/post-read.entity';
import { Report } from '../reports/report.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 40 })
  title: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Forum, (forum) => forum.posts)
  @JoinColumn({ name: 'forumId' })
  forum: Forum;

  @ManyToOne(() => Prefix, (prefix) => prefix.posts)
  @JoinColumn({ name: 'prefixId' })
  prefix: Prefix;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  postedOn: Date;

  @Column({ type: 'int', default: 0 })
  numberOfComments: number;

  @Column({ default: false })
  isLocked: boolean;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Column({ type: 'varchar', length: 4000 })
  content: string;

  @OneToMany(
    () => PostSubscription,
    (postSubscription) => postSubscription.post,
  )
  subscriptions: PostSubscription[];

  @OneToMany(() => PostRead, (postRead) => postRead.post)
  readPosts: PostRead[];

  @OneToMany(() => Report, (report) => report.post)
  postReports: Report[];
}
