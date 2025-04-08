import { Conversation } from '../conversations/entities/conversation.entity';
import { InventoryItem } from '../inventory-item/inventory-item.entity';
import { Order } from '../order/order.entity';
import { User } from '../user/entities/user.entity';
import { Organization } from '../organization/organization.entity';
import { Report } from '../reports/report.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  Geometry,
  DeleteDateColumn,
} from 'typeorm';

export enum ListingStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
  COMPLETE = 'complete',
}

@Entity()
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'inventoryItemId' })
  @ManyToOne(() => InventoryItem, (invItem) => invItem.listings)
  inventoryItem: InventoryItem;

  @Column()
  inventoryItemId: number;

  @JoinColumn({ name: 'organizationId' })
  @ManyToOne(() => Organization, (org) => org.listings)
  organization: Organization;

  @Column()
  organizationId: number;

  @Column({ type: 'varchar', length: 40 })
  name: string;

  @Column({ type: 'varchar', length: 2000 })
  description: string;

  @Column({ type: 'jsonb' })
  attributes: object;

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'enum', enum: ListingStatus, default: ListingStatus.ACTIVE })
  status: ListingStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'geography', srid: 4326, spatialFeatureType: 'Point' })
  point: Geometry;

  @Column({ type: 'tsvector' })
  ftsVector: string;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Order, (order) => order.provider)
  orders: Order[];

  @OneToMany(() => Conversation, (conversation) => conversation.listing)
  conversations: Conversation[];

  @ManyToMany(() => User, (user) => user.bookmarks)
  bookmarks: User[];

  @OneToMany(() => Report, (report) => report.listing)
  reports: Report[];
}
