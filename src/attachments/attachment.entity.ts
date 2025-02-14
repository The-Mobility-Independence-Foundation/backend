import { User } from '../user/user.entity';
import { Listing } from '../listing/listing.entity';
import { Message } from '../message/message.entity';
import { Post as PostEntity } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.attachmentsCreated)
  author: User;

  @Column({ type: 'varchar', length: 10 })
  entity_id: string;

  @Column({ type: 'varchar', length: 20 })
  entity_type: string;

  @Column({ type: 'varchar', length: 20 })
  file_name: string;

  @Column({ type: 'varchar', length: 15 })
  file_size: string;

  @Column({ type: 'varchar', length: 20 })
  mime_type: string;

  @Column({ type: 'text' })
  storage_url: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @JoinColumn()
  @ManyToOne(() => Listing, (listing) => listing.attachments, {
    nullable: true,
  })
  listing: Listing | null;

  @JoinColumn()
  @ManyToOne(() => Message, (message) => message.attachments, {
    nullable: true,
  })
  message: Message | null;

  @JoinColumn()
  @ManyToOne(() => PostEntity, (post) => post.attachments, { nullable: true })
  post: PostEntity | null;

  @JoinColumn()
  @ManyToOne(() => Comment, (comment) => comment.attachments, {
    nullable: true,
  })
  comment: Comment | null;
}
