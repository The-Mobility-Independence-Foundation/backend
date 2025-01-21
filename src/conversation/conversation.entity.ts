import { Message } from 'src/message/message.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, default: null }) // TODO: set foreign key on listing
    listing: number;

    @Column()
    participant1: number;

    @Column()
    participant2: number;

    @OneToMany(type => Message, message => message.conversation)
    messages: Message[];

}