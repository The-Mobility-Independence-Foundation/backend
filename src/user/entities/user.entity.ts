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
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';
import { Message } from '../../message/message.entity';
import { Listing } from '../../listing/listing.entity';
import { Conversation } from '../../conversation/conversation.entity';
import { Post } from '../../post/post.entity';
import { Comment } from '../../comment/comment.entity';
import { PostSubscription } from '../../post-subscription/post-subscription.entity';
import { PostRead } from '../../post-read/post-read.entity';
import { Report } from '../../reports/report.entity';
import { Audit } from '../../audit/audit.entity';
import { Attachment } from '../../attachments/attachment.entity';
import { UserAuth } from './user-auth.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => Organization, (org) => org.members)
  organization: Organization | null;

  @Column({ type: 'varchar', length: 20 })
  firstName: string;

  @Column({ type: 'varchar', length: 20 })
  lastName: string;

  @Column({ type: 'varchar', length: 30 })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  displayName: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  type: UserRole;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastActivity: Date;

  @Column({ default: false })
  inactive: boolean;

  @Column({ type: 'varchar', default: '0000000000', length: 10 })
  referralCode: string;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.referrals, { nullable: true })
  referredBy: User | null;

  @Column({ type: 'decimal', default: 0.0 })
  rating: number;

  @Column({ default: false })
  signupComplete: boolean;

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

  @JoinTable({ name: 'bookmarks' })
  @ManyToMany(() => Listing, (listing) => listing.bookmarks)
  bookmarks: Listing[];

  @JoinTable({ name: 'connections' })
  @ManyToMany(() => User, (user) => user.connectionsRecieved)
  connectionsSent: User[];

  @ManyToMany(() => User, (user) => user.connectionsSent)
  connectionsRecieved: User[];

  @OneToMany(
    () => Conversation,
    (conversation) => conversation.participant1 && conversation.participant2,
  )
  conversations: Conversation[];

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

  @JoinColumn()
  @OneToOne(() => UserAuth, (auth) => auth.user)
  auth: UserAuth;
}
