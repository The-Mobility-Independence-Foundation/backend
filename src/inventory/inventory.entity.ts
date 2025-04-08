import { Address } from '../address/address.entity';
import { InventoryItem } from '../inventory-item/inventory-item.entity';
import { Organization } from '../organization/organization.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'organizationId' })
  @ManyToOne(() => Organization, (organization) => organization.inventories)
  organization: Organization;

  @Column()
  organizationId: number;

  @Column({ type: 'varchar', length: 40 })
  name: string;

  @Column({ type: 'varchar', length: 200 })
  description: string;

  @DeleteDateColumn()
  archivedAt?: Date;

  @JoinColumn({ name: 'addressId' })
  @ManyToOne(() => Address, (address) => address.inventories)
  address: Address;

  @Column()
  addressId: number;

  @Column({ type: 'float', nullable: false })
  latitude: number;

  @Column({ type: 'float', nullable: false })
  longitude: number;

  @OneToMany(() => InventoryItem, (item) => item.inventory)
  items: InventoryItem[];
}
