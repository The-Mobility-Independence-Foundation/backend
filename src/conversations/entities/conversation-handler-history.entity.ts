import { User } from '../../user/entities/user.entity';
import { Conversation } from './conversation.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
  JoinColumn,
} from 'typeorm';

@Entity()
export class ConversationHandlerHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  assignedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  unassignedAt: Date | null;

  @JoinColumn({ name: 'conversationId' })
  @ManyToOne(() => Conversation, (conversation) => conversation.handlerHistory)
  conversation: Conversation;

  @Column()
  conversationId: number;

  @JoinColumn({ name: 'handlerId' })
  @ManyToOne(() => User)
  handler: User;

  @Column()
  handlerId: number;
}
