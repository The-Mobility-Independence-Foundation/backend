import { LargeNumberLike } from 'crypto';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Review {

    @PrimaryGeneratedColumn()
    reviewID: number;

    @Column({ nullable: false }) // TODO: foreign key on user 
    reviewerID: number;

    @Column({ nullable: false }) // TODO: foreign key on user
    reviewedUserID: number;

    @Column({ nullable: false }) // TODO: foreign key on order 
    orderID: number;

    @Column({ type: "varchar", length: 4000 }) 
    description: string;

    @Column() 
    rating: number;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    sentOn: number;

}