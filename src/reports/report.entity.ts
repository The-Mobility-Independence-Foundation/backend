import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Listing } from '../listing/listing.entity';
import { Post as PostEntity } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';

export enum ReportType {
  PROFILE = 'profile',
  LISTING = 'listing',
  POST = 'post',
  COMMENT = 'comment',
}

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reportsSent)
  @JoinColumn({ name: 'reporterId' })
  reporter: User;

  @ManyToOne(() => User, (user) => user.reportsRecieved, { nullable: true })
  @JoinColumn({ name: 'offenderId' })
  offender: User | null;

  @ManyToOne(() => User, (user) => user.reportsHandled)
  @JoinColumn({ name: 'moderatorId' })
  moderator: User;

  @ManyToOne(() => Listing, (listing) => listing.reports, { nullable: true })
  @JoinColumn({ name: 'listingId' })
  listing: Listing | null;

  @ManyToOne(() => PostEntity, (post) => post.postReports, { nullable: true })
  @JoinColumn({ name: 'postId' })
  post: PostEntity | null;

  @ManyToOne(() => Comment, (comment) => comment.report, { nullable: true })
  @JoinColumn({ name: 'commentId' })
  comment: Comment | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  reportedOn: Date;

  @Column({ type: 'varchar', length: 3000 })
  reason: string;

  @Column({ type: 'enum', enum: ReportType, default: ReportType.POST })
  type: ReportType;

  @Column({ type: 'timestamp', nullable: true, default: null })
  actionTakenOn: Date | null;

  @Column({ type: 'varchar', length: 3000, nullable: true, default: null })
  actionTaken: string | null;
}
