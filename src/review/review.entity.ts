import { Order } from '../order/order.entity';
import { User } from '../user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';


@Entity()
export class Review {

    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn()
    @ManyToOne(() => User, user => user.sentReviews)
    reviewer: User;

    @JoinColumn()
    @ManyToOne(() => User, user => user.receivedReviews)
    reviewedUser: User;

    @JoinColumn()
    @ManyToOne(() => Order, order => order.receivedReviews)
    order: Order;

    @Column({ type: "varchar", length: 4000 }) 
    content: string;

    @Column() 
    rating: number;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    sentOn: Date;
}