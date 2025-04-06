import { Conversation } from '../conversation/conversation.entity';
import { User } from '../user/entities/user.entity';
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

  @Column({ type: 'varchar', length: 2000 })
  content?: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  readStatus: Date | null;
}
