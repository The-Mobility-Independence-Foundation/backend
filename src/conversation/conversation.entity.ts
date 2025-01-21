import { Listing } from 'src/listing/listing.entity';
import { Message } from 'src/message/message.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn() 
    @ManyToOne(type => Listing, listing => listing.conversations)
    listing: Listing | null;

    @Column() // TODO: foreign key on user (composite key?)
    participant1: number;

    @Column() // TODO: foreign key on user (composite key?)
    participant2: number;

    @OneToMany(type => Message, message => message.conversation)
    messages: Message[];

}