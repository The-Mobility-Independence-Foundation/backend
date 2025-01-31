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

  @Column()
  numberOfComments: number;

  @Column({ default: false })
  isLocked: boolean;

  @OneToMany(() => Comment, (comment) => comment.post) // One user can have many posts
  comments: Comment[];
}
