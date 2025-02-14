import { Conversation } from '../conversation/conversation.entity';
import { InventoryItem } from '../inventory-item/inventory-item.entity';
import { Order } from '../order/order.entity';
import { User } from '../user/user.entity';
import { Report } from '../reports/report.entity';
import { Attachment } from '../attachments/attachment.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';

export enum ListingStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMPLETE = 'complete',
  ARCHIVED = 'archived',
}

@Entity()
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => InventoryItem, (invItem) => invItem.listings)
  inventoryItem: InventoryItem;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.listings)
  owner: User;

  @Column({ type: 'varchar', length: 40 })
  name: string;

  @Column({ type: 'varchar', length: 4000 })
  description: string;

  // Change to jsonB
  @Column({ type: 'varchar', length: 4000 })
  attributes: string;

  @Column({ default: 1 })
  quantity: number;

  // TODO: research to see if theres a better way to handle location
  @Column({ type: 'float', nullable: false })
  latitude: number;

  @Column({ type: 'float', nullable: false })
  longitude: number;

  @Column({ default: false })
  inactive: boolean;

  @Column({ type: 'varchar', length: 10 })
  zipcode: string;

  @Column({ type: 'enum', enum: ListingStatus, default: ListingStatus.ACTIVE })
  state: ListingStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => Order, (order) => order.owner)
  orders: Order[];

  @OneToMany(() => Conversation, (conversation) => conversation.listing)
  conversations: Conversation[];

  @ManyToMany(() => User, (user) => user.bookmarks)
  bookmarks: User[];

  @OneToMany(() => Report, (report) => report.listing)
  reports: Report[];

  @OneToMany(() => Attachment, (attachment) => attachment.listing)
  attachments: Attachment[];
}
