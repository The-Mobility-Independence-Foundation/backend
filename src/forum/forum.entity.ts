import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  VirtualColumn,
} from 'typeorm';
import { Prefix } from '../prefix/prefix.entity';
import { Post } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';

@Entity()
export class Forum {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Forum, (forum) => forum.childForums, { nullable: true })
  @JoinColumn({ name: 'parentForumId' })
  parentForum: Forum | null;

  @Column({ type: 'varchar', length: 80, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 200 })
  description: string;

  @Column({ default: false })
  isCategory: boolean;

  @Column()
  order: number;

  @Column({ default: false })
  isLocked: boolean;

  @VirtualColumn({
    query: (alias) => `(SELECT COUNT(*) FROM post WHERE post.forumId = ${alias}.id)`,
  })
  numberOfPosts: number;

  @VirtualColumn({
    query: (alias) => `(SELECT COUNT(*) FROM comment WHERE comment.forumId = ${alias}.id)`,
  })
  numberOfComments: number;

  @OneToMany(() => Forum, (forum) => forum.parentForum)
  childForums: Forum[];

  @OneToMany(() => Prefix, (prefix) => prefix.forumsUsed)
  prefixes: Prefix[];

  @OneToMany(() => Post, (post) => post.forum)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.forum)
  comments: Comment[];
}
