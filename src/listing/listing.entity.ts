import { Conversation } from '../conversation/conversation.entity';
import { InventoryItem } from '../inventory-item/inventory-item.entity';
import { Order } from '../order/order.entity';
import { Organization } from '../organization/organization.entity';
import { Report } from '../reports/report.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Bookmark } from '../bookmarks/bookmarks.entity';

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
  @ManyToOne(() => Organization, (org) => org.listings)
  owner: Organization;

  @Column({ type: 'varchar', length: 40 })
  name: string;

  @Column({ type: 'varchar', length: 2000 })
  description: string;

  @Column({ type: 'jsonb' })
  attributes: object;

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'float', nullable: false })
  latitude: number;

  @Column({ type: 'float', nullable: false })
  longitude: number;

  @Column({ default: false })
  inactive: boolean;

  @Column({ type: 'varchar', length: 10 })
  zipCode: string;

  @Column({ type: 'enum', enum: ListingStatus, default: ListingStatus.ACTIVE })
  state: ListingStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => Order, (order) => order.provider)
  orders: Order[];

  @OneToMany(() => Conversation, (conversation) => conversation.listing)
  conversations: Conversation[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.listing)
  bookmarks: Bookmark[];

  @OneToMany(() => Report, (report) => report.listing)
  reports: Report[];
}
