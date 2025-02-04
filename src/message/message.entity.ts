import { Conversation } from '../conversation/conversation.entity';
import { User } from '../user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.sentMessages)
  author: User;

  @JoinColumn()
  @ManyToOne(() => Conversation, (conv) => conv.messages)
  conversation: Conversation;

  @Column({ type: 'varchar', length: 4000 })
  messageContent: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  readStatus: Date;
}
