import { Inventory } from '../inventory/inventory.entity';
import { Invite } from '../invite/invite.entity';
import { Order } from '../order/order.entity';
import { User } from '../user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  OneToOne,
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

  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 10 })
  ein: string;

  @Column({ type: 'varchar', length: 50, array: true, nullable: true })
  socials: string[];

  @OneToMany(() => User, (user) => user.organization)
  members: User[];

  @OneToMany(() => Order, (order) => order.owner)
  orders: Order[];

  @OneToMany(() => Invite, (invite) => invite.organization)
  sentInvites: Invite[];
}
