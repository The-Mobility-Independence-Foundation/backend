import { Listing } from '../listing/listing.entity';
import { Review } from '../review/review.entity';
import { User } from '../user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

export enum OrderStatus {
  INITIATED = 'initiated',
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  VOIDED = 'voided',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => Listing, (listing) => listing.orders)
  listing: Listing;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.ordersManaged)
  owner: User;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.orders)
  recipient: User;

  @Column()
  quantity: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  dateCompleted: Date;

  @Column({ type: 'varchar', length: 100 })
  addressLine1: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  addressLine2: string;

  @Column({ type: 'varchar', length: 30 })
  city: string;

  @Column({ type: 'varchar', length: 15 })
  state: string;

  @Column({ type: 'varchar', length: 10 })
  zipcode: string;

  @OneToMany(() => Review, (review) => review.order)
  receivedReviews: Review[];
}
