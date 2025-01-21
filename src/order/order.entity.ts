import { Listing } from 'src/listing/listing.entity';
import { Organization } from 'src/organization/organization.entity';
import { Review } from 'src/review/review.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

export enum OrderStatus {
    INITIATED = "initiated", 
    PENDING = "pending",
    FULFILLED = "fulfilled", 
    VOIDED = "voided"
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn()
    @ManyToOne(type => Listing, listing => listing.orders)
    listing: Listing;

    @JoinColumn()
    @ManyToOne(type => Organization, org => org.orders)
    owner: Organization;

    @JoinColumn()
    @ManyToOne(type => User, user => user.orders)
    recipient: User;

    @Column()
    quantity: number;

    @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    dateCreated: Date;

    @Column({ type: "timestamp", nullable: true, default: null })
    dateCompleted: Date;

    @OneToMany(type => Review, review => review.order)
    receivedReviews: Review[];
}