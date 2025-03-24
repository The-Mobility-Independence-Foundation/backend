import { User } from '../../user/entities/user.entity';
import { Listing } from '../../listing/listing.entity';
import { Message } from '../../message/message.entity';
import { ConversationHistory } from './conversation-history.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

export enum ConversationType {
  DIRECT = 'direct',
  INQUIRY = 'inquiry',
}

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ConversationType,
    default: ConversationType.DIRECT,
  })
  type: ConversationType;

  @JoinColumn({ name: 'listingId' })
  @ManyToOne(() => Listing, (listing) => listing.conversations, {
    nullable: true,
  })
  listing: Listing | null;

  @Column({ nullable: true })
  listingId: number | null;

  @JoinColumn({ name: 'initiatorId' })
  @ManyToOne(() => User, (user) => user.initiatedConversations)
  initiator: User;

  @Column()
  initiatorId: number;

  @JoinColumn({ name: 'participantId' })
  @ManyToOne(() => User, (user) => user.participantConversations, {
    nullable: true,
  })
  participant: User | null;

  @Column({ nullable: true })
  participantId: number | null;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @OneToMany(() => ConversationHistory, (history) => history.conversation)
  history: ConversationHistory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
