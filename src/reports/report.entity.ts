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

export enum ReportType {
  PROFILE = 'profile',
  LISTING = 'listing',
  POST = 'post',
}

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reportsSent)
  @JoinColumn({ name: 'reporterId' })
  reporter: User;

  @ManyToOne(() => User, (user) => user.reportsSent)
  @JoinColumn({ name: 'responderId' })
  respondent: User;

  @ManyToOne(() => Listing, (listing) => listing.listingReports)
  @JoinColumn({ name: 'listingId' })
  listing: Listing;

  @ManyToOne(() => PostEntity, (post) => post.postReports)
  @JoinColumn({ name: 'postId' })
  post: PostEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  reportedOn: Date;

  @Column({ type: 'varchar', length: 3000 })
  reason: string;

  @Column({ type: 'enum', enum: ReportType, default: ReportType.POST })
  type: ReportType;
}
