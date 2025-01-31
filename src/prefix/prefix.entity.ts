import { Post } from '../post/post.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Forum } from '../forum/forum.entity';

@Entity()
export class Prefix {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @ManyToOne(() => Forum, (forum) => forum.prefixes)
  @JoinColumn({ name: 'forumId' })
  forumsUsed: Forum;

  @OneToMany(() => Post, (post) => post.prefix)
  posts: Post[];
}
