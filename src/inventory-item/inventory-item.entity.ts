import { Inventory } from '../inventory/inventory.entity';
import { Listing } from '../listings/listing.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Check,
  DeleteDateColumn,
} from 'typeorm';
import { Tag } from '../tag/tag.entity';
import { Part } from '../part/part.entity';
import { IsOptional } from 'class-validator';
import { Model } from '../model/model.entity';

@Entity()
export class InventoryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'partId' })
  @ManyToOne(() => Part, (part) => part.inventoryItems)
  part: Part;

  @Column()
  partId: number;

  @JoinColumn({ name: 'modelId' })
  @ManyToOne(() => Model, (model) => model.inventoryItems)
  model: Model;

  @Column()
  modelId: number;

  @JoinColumn({ name: 'inventoryId' })
  @ManyToOne(() => Inventory, (inventory) => inventory.items)
  inventory: Inventory;

  @Column()
  inventoryId: number;

  @Column({ default: 0 })
  quantity: number;

  @Column({ default: 0 })
  @Check(`"publicCount" <= "quantity"`)
  publicCount: number;

  @DeleteDateColumn()
  archivedAt: Date;

  @IsOptional()
  @Column({ type: 'varchar', length: 500, nullable: true })
  notes?: string | null;

  @IsOptional()
  @Column({ type: 'jsonb', nullable: true })
  attributes?: object | null;

  @OneToMany(() => Listing, (listing) => listing.inventoryItem)
  listings: Listing[];

  @ManyToMany(() => Tag, (tag) => tag.inventoryItems)
  @JoinTable()
  tags: Tag[];
}
