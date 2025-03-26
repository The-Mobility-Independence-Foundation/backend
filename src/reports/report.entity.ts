import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Listing } from '../listing/listing.entity';
import { Post as PostEntity } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  MaxLength,
} from 'class-validator';

export enum ReportType {
  PROFILE = 'profile',
  LISTING = 'listing',
  POST = 'post',
  COMMENT = 'comment',
}

@Entity()
export class Report {
  @IsPositive()
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @ManyToOne(() => User, (user) => user.reportsSent)
  @JoinColumn({ name: 'reporterId' })
  reporter: User;

  @IsOptional()
  @ManyToOne(() => User, (user) => user.reportsRecieved, { nullable: true })
  @JoinColumn({ name: 'offenderId' })
  offender?: User | null;

  @IsOptional()
  @ManyToOne(() => User, (user) => user.reportsHandled)
  @JoinColumn({ name: 'moderatorId' })
  moderator?: User | null;

  @IsOptional()
  @ManyToOne(() => Listing, (listing) => listing.reports, { nullable: true })
  @JoinColumn({ name: 'listingId' })
  listing?: Listing | null;

  @IsOptional()
  @ManyToOne(() => PostEntity, (post) => post.postReports, { nullable: true })
  @JoinColumn({ name: 'postId' })
  post?: PostEntity | null;

  @IsOptional()
  @ManyToOne(() => Comment, (comment) => comment.report, { nullable: true })
  @JoinColumn({ name: 'commentId' })
  comment?: Comment | null;

  @CreateDateColumn()
  reportedOn: Date;

  @Column({ type: 'varchar', length: 200 })
  reason: string;

  @IsEnum(ReportType)
  @Column({ type: 'enum', enum: ReportType, default: ReportType.POST })
  type: ReportType;

  @IsOptional()
  @Column({ type: 'timestamp', nullable: true, default: null })
  actionTakenOn?: Date | null;

  @IsOptional()
  @MaxLength(200)
  @Column({ type: 'varchar', length: 200, nullable: true, default: null })
  actionTaken?: string | null;
}
