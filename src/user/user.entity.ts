import { Invite } from 'src/invite/invite.entity';
import { Order } from 'src/order/order.entity';
import { Organization } from 'src/organization/organization.entity';
import { Review } from 'src/review/review.entity';
import { Request } from 'src/request/request.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Message } from 'src/message/message.entity';
import { Listing } from 'src/listing/listing.entity';

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
}