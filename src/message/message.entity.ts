import { Conversation } from 'src/conversation/conversation.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Message {

    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn()
    @ManyToOne(type => User, user => user.sentMessages)
    sender: User;

    @JoinColumn()
    @ManyToOne(type => Conversation, conv => conv.messages)
    conversation: Conversation;

    @Column({ type: "varchar", length: 4000 })
    messageContent: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    readStatus: Date;

}