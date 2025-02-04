import { User } from '../user/user.entity';
import { Listing } from '../listing/listing.entity';
import { Message } from '../message/message.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => Listing, (listing) => listing.conversations)
  listing: Listing | null;

  @ManyToOne(() => User, (user) => user.conversations)
  participant1: User;

  @ManyToOne(() => User, (user) => user.conversations)
  participant2: User;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}
