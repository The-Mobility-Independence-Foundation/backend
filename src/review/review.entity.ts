import { LargeNumberLike } from 'crypto';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Review {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false }) // TODO: foreign key on user 
    reviewer: number;

    @Column({ nullable: false }) // TODO: foreign key on user
    reviewedUser: number;

    @Column({ nullable: false }) // TODO: foreign key on order 
    order: number;

    @Column({ type: "varchar", length: 4000 }) 
    description: string;

    @Column() 
    rating: number;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    sentOn: Date;

}