import { Conversation } from '../conversations/entities/conversation.entity';
import { User } from '../user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'authorId' })
  @ManyToOne(() => User, (user) => user.sentMessages)
  author: User;

  @Column()
  authorId: number;

  @JoinColumn({ name: 'conversationId' })
  @ManyToOne(() => Conversation, (conv) => conv.messages)
  conversation: Conversation;

  @Column()
  conversationId: number;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  content?: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  readStatus: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
