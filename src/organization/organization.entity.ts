import { Audit } from '../audit/audit.entity';
import { Listing } from '../listing/listing.entity';
import { Inventory } from '../inventory/inventory.entity';
import { Invite } from '../invite/invite.entity';
import { Order } from '../order/order.entity';
import { User } from '../user/entities/user.entity';
import { Address } from '../address/address.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Inventory, (inventory) => inventory.organization)
  inventories: Inventory[];

  @JoinColumn()
  @OneToOne(() => User, (owner) => owner.organization)
  owner: User;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastActivity: Date;

  @Column({ default: false })
  inactive: boolean;

  @Column({ type: 'varchar', length: 4000, default: '' })
  services: string;

  @Column({ type: 'decimal', default: 0.0 })
  rating: number;

  @JoinColumn()
  @ManyToOne(() => Address, (address) => address.organizations)
  address: Address;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 10 })
  ein: string;

  @Column({ type: 'varchar', length: 50, array: true, nullable: true })
  socials: string[];

  @OneToMany(() => User, (user) => user.organization)
  members: User[];

  @OneToMany(() => Order, (order) => order.providerOrganization)
  orders: Order[];

  @OneToMany(() => Order, (order) => order.recipientOrganization)
  ordersMade: Order[];

  @OneToMany(() => Invite, (invite) => invite.organization)
  sentInvites: Invite[];

  @OneToMany(() => Audit, (audit) => audit.organization)
  audits: Audit[];

  @OneToMany(() => Listing, (listing) => listing.owner)
  listings: Listing[];
}
