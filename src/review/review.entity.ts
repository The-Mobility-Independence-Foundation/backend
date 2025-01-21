import { Order } from 'src/order/order.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';


@Entity()
export class Review {

    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn()
    @ManyToOne(type => User, user => user.sentReviews)
    reviewer: User;

    @JoinColumn()
    @ManyToOne(type => User, user => user.receivedReviews)
    reviewedUser: User;

    @JoinColumn()
    @ManyToOne(type => Order, order => order.receivedReviews)
    order: Order;

    @Column({ type: "varchar", length: 4000 }) 
    description: string;

    @Column() 
    rating: number;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    sentOn: Date;
}