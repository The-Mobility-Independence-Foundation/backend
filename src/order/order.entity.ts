import { Organization } from '../organization/organization.entity';
import { Listing } from '../listing/listing.entity';
import { Review } from '../review/review.entity';
import { User } from '../user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Address } from '../address/address.entity';

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
  provider: User | null;

  @JoinColumn()
  @ManyToOne(() => Organization, (org) => org.orders)
  providerOrganization: Organization;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.orders)
  recipient: User;

  @JoinColumn()
  @ManyToOne(() => Organization, (org) => org.ordersMade)
  recipientOrganization: Organization;

  @Column()
  quantity: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  dateCompleted: Date;

  @JoinColumn()
  @ManyToOne(() => Address, (address) => address.orders)
  address: Address;

  @OneToMany(() => Review, (review) => review.order)
  receivedReviews: Review[];
}
