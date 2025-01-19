import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn()
    conversationID: number;

    @Column({ nullable: true, default: null }) // TODO: set foreign key on listing
    listingID: number;

    @Column()
    participant1ID: number;

    @Column()
    participant2ID: number;

}