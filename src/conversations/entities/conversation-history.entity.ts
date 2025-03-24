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
import { Index } from 'typeorm/decorator/Index';

@Entity()
@Index(['conversationId', 'participantId'])
export class ConversationHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  assignedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  unassignedAt: Date | null;

  @JoinColumn({ name: 'conversationId' })
  @ManyToOne(() => Conversation, (conversation) => conversation.history)
  conversation: Conversation;

  @Column()
  conversationId: number;

  @JoinColumn({ name: 'participantId' })
  @ManyToOne(() => User)
  participant: User;

  @Column()
  participantId: number;
}
