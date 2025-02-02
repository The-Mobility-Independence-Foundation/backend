import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Post } from '../post/post.entity';
import { User } from '../user/user.entity';
import { Forum } from '../forum/forum.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Comment, (comment) => comment.childComment, { nullable: true })
  @JoinColumn({ name: "parentCommentId" })
  parentComment: Comment | null;

  @OneToMany((() => Comment), (comment) => comment.parentComment)
  childComment: Comment[];

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @ManyToOne(() => Forum, (forum) => forum.comments)
  @JoinColumn({ name: 'forumId' })
  forum: Forum;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  postedOn: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  editedOn: Date | null;

  @ManyToOne(() => User, (user) => user.editedComments)
  @JoinColumn({ name: 'editorId' })
  editedBy: User;

  @Column({ type: 'jsonb' })
  content: Record<string, any>;
}
