import { Inventory } from '../inventory.entity';
import { Listing } from '../../listing/listing.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class InventoryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false }) // TODO: set foreign key on part
  part: number;

  @Column({ nullable: false }) // TODO: set foreign key on model
  model: number;

  @JoinColumn()
  @ManyToOne(() => Inventory, (inventory) => inventory.items)
  inventory: Inventory;

  @Column({ default: 0 })
  quantity: number;

  @Column({ default: 0 })
  publicCount: number;

  @Column({ type: 'varchar', length: 4000 })
  notes: string;

  @Column({ type: 'varchar', length: 4000 })
  attributes: string;

  @OneToMany(() => Listing, (listing) => listing.inventoryItem)
  listings: Listing[];
}
