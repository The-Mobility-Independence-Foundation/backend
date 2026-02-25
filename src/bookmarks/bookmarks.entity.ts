import { User } from '../user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Listing } from '../listings/listing.entity';

@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.bookmarks)
  user: User;

  @JoinColumn()
  @ManyToOne(() => Listing, (listing) => listing.bookmarks)
  listing: Listing;

  @CreateDateColumn()
  dateCreated: Date;
}
