import { Invite } from '../invite/invite.entity';
import { Order } from '../order/order.entity';
import { Organization } from '../organization/organization.entity';
import { Review } from '../review/review.entity';
import { Request } from '../request/request.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Message } from '../conversation/message/message.entity';
import { Listing } from '../listing/listing.entity';
import { Post } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';

export enum UserRole {
    USER = "user", 
    ADMIN = "admin",
    MODERATOR = "moderator"
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn()
    @ManyToOne(() => Organization, org => org.members)
    organization: Organization | null; 

    @Column({ type: "varchar", length: 20 })
    firstName: string;

    @Column({ type: "varchar", length: 20 })
    lastName: string;

    @Column({ type: "varchar", length: 30 })
    email: string;

    @Column({ type: "varchar", length: 50 }) // TODO: update with a salt and a hash
    password: string;

    // make unique eventually?
    // returns a 500 server error unless we catch the duplicate name error ourselves. 
    // userID will still increment if a unique name is sent though, leaving us with blank rows
    @Column({ type: "varchar", length: 20 })
    displayName: string;

    @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
    accType: UserRole;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    lastActivity: Date;

    @Column({ default: false })
    inactive: boolean;

    @Column({ type: "varchar", default: '0000000000', length: 10 })
    referralCode: string;

    @JoinColumn()
    @ManyToOne(() => User, user => user.referrals)
    referredBy: User;

    @Column({ type: 'decimal', default: 0.0})
    rating: number;

    @Column({ default: false })
    signupComplete: boolean;

    @OneToMany(() => User, user => user.referredBy)
    referrals: User[];

    @OneToMany(() => Order, order => order.recipient)
    orders: Order[];

    @OneToMany(() => Order, order => order.owner)
    ordersManaged: Order[];

    @OneToMany(() => Invite, invite => invite.sender)
    sentInvites: Invite[];

    @OneToMany(() => Review, review => review.reviewer)
    sentReviews: Review[];

    @OneToMany(() => Review, review => review.reviewedUser)
    receivedReviews: Review[];

    @OneToMany(() => Request, request => request.approver)
    approvedRequests: Request[];

    @OneToMany(() => Message, message => message.sender)
    sentMessages: Message[];

    @OneToMany(() => Listing, listing => listing.owner)
    listings: Listing[];

    @OneToMany(() => Post, (post) => post.user) 
    posts: Post[];

    @OneToMany(() => Comment, (comment) => comment.author)  
    comments: Comment[];

    @OneToMany(() => Comment, (comment) => comment.editedBy)  
    editedComments: Comment[];
}