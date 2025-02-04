import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
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

  // TODO: MANY TO ONE WITH USER
  @Column()
  reporter: User;

  // TODO: MANY TO ONE WITH USER
  @Column()
  respondent: User;

  // TODO: MANY TO ONE WITH Listing
  @Column()
  listing: Listing;

  // TODO: MANY TO ONE WITH Post
  @Column()
  post: PostEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  reportedOn: Date;

  @Column({ type: 'varchar', length: 3000 })
  reason: string;

  @Column({ type: 'enum', enum: ReportType, default: ReportType.POST })
  type: ReportType;
}
