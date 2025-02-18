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
} from 'typeorm';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => Organization, (organization) => organization.inventories)
  organization: Organization;

  @Column({ type: 'varchar', length: 40 })
  name: string;

  @Column({ type: 'varchar', length: 200 })
  description: string;

  @JoinColumn()
  @ManyToOne(() => Address, (address) => address.inventories)
  address: Address;

  @OneToMany(() => InventoryItem, (item) => item.inventory)
  items: InventoryItem[];
}
