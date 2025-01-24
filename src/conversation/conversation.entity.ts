import { Listing } from '../listing/listing.entity';
import { Message } from './message/message.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn() 
    @ManyToOne(() => Listing, listing => listing.conversations)
    listing: Listing | null;

    @Column() // TODO: foreign key on user (composite key?)
    participant1: number;

    @Column() // TODO: foreign key on user (composite key?)
    participant2: number;

    @OneToMany(() => Message, message => message.conversation)
    messages: Message[];

}