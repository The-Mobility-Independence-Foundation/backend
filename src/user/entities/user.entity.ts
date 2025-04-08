import { Invite } from '../../invite/invite.entity';
import { Order } from '../../order/order.entity';
import { Organization } from '../../organization/organization.entity';
import { Review } from '../../review/review.entity';
import { Request } from '../../request/request.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
  Index,
} from 'typeorm';
import { Message } from '../../message/message.entity';
import { Conversation } from '../../conversations/entities/conversation.entity';
import { Post } from '../../post/post.entity';
import { Comment } from '../../comment/comment.entity';
import { PostSubscription } from '../../post-subscription/post-subscription.entity';
import { PostRead } from '../../post-read/post-read.entity';
import { Report } from '../../reports/report.entity';
import { Audit } from '../../audit/audit.entity';
import { Attachment } from '../../attachments/attachment.entity';
import {
  IsEnum,
  IsBoolean,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import {
  IsFirstName,
  IsLastName,
  IsDisplayName,
  IsEmail,
} from '../../common/decorators/user.decorators';
import { UserValidation } from '../../common/validation/user.validation';
import { UserAuth } from './user-auth.entity';
import { Bookmark } from '../../bookmarks/bookmarks.entity';

import { Connection } from '../../connections/connection.entity';
import { ConversationHistory } from '../../conversations/entities/conversation-history.entity';
/**
 * The role of a user
 */
export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

/**
 * A user
 */
@Entity()
@Index(['email'], { unique: true })
@Index(['displayName'])
@Index(['type'])
@Index(['organizationId'])
@Index(['inactive'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'organizationId' })
  @ManyToOne(() => Organization, (org) => org.members)
  organization: Organization | null;

  @Column({ nullable: true })
  organizationId: number | null;

  @IsFirstName()
  @Column({ type: 'varchar', length: UserValidation.firstName.max })
  firstName: string;

  @IsLastName()
  @Column({ type: 'varchar', length: UserValidation.lastName.max })
  lastName: string;

  @IsEmail()
  @Column({ type: 'varchar', length: UserValidation.email.max })
  email: string;

  @IsDisplayName()
  @Column({ type: 'varchar', length: UserValidation.displayName.max })
  displayName: string;

  @IsEnum(UserRole)
  @Column({ type: 'enum', enum: UserRole, default: UserRole.GUEST })
  type: UserRole;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastActivity: Date;

  @IsBoolean()
  @Column({ default: false })
  inactive: boolean;

  @Column({ type: 'varchar', length: 10, nullable: true })
  referralCode?: string | null;

  @IsOptional()
  @ManyToOne(() => User, (user) => user.referrals, { nullable: true })
  @JoinColumn()
  referredBy?: User | null;

  @IsNumber()
  @Min(0)
  @Max(5)
  @Column({ type: 'decimal', default: 0.0 })
  rating: number;

  @OneToMany(() => User, (user) => user.referredBy)
  referrals: User[];

  @OneToMany(() => Order, (order) => order.recipient)
  orders: Order[];

  @OneToMany(() => Order, (order) => order.provider)
  ordersManaged: Order[];

  @OneToMany(() => Invite, (invite) => invite.inviter)
  sentInvites: Invite[];

  @OneToMany(() => Review, (review) => review.reviewer)
  sentReviews: Review[];

  @OneToMany(() => Review, (review) => review.reviewedUser)
  receivedReviews: Review[];

  @OneToMany(() => Request, (request) => request.approver)
  approvedRequests: Request[];

  @OneToMany(() => Message, (message) => message.author)
  sentMessages: Message[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks: Bookmark[];

  @OneToMany(() => Connection, (connection) => connection.follower)
  following: Connection[];

  @OneToMany(() => Connection, (connection) => connection.following)
  followers: Connection[];

  @OneToMany(() => Conversation, (conversation) => conversation.initiator)
  initiatedConversations: Conversation[];

  @OneToMany(() => ConversationHistory, (history) => history.participant)
  handledConversations: ConversationHistory[];

  @OneToMany(() => Conversation, (conversation) => conversation.participant)
  participantConversations: Conversation[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Comment, (comment) => comment.editedBy)
  editedComments: Comment[];

  @OneToMany(
    () => PostSubscription,
    (postSubscription) => postSubscription.subscriber,
  )
  subscriptions: PostSubscription[];

  @OneToMany(() => PostRead, (postRead) => postRead.user)
  postsRead: PostRead[];

  @OneToMany(() => Report, (report) => report.reporter)
  reportsSent: Report[];

  @OneToMany(() => Report, (report) => report.offender)
  reportsRecieved: Report[];

  @OneToMany(() => Report, (report) => report.moderator)
  reportsHandled: Report[];

  @OneToMany(() => Audit, (audit) => audit.user)
  audits: Audit[];

  @OneToMany(() => Attachment, (attachment) => attachment.author)
  attachmentsCreated: Attachment[];

  @OneToOne(() => UserAuth, (auth) => auth.user, {
    cascade: true,
    nullable: false,
  })
  @JoinColumn()
  auth: UserAuth;
}
