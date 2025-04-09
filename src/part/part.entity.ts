import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Model } from '../model/model.entity';
import { InventoryItem } from '../inventory-item/inventory-item.entity';
import { IsOptional } from 'class-validator';

@Entity()
export class PartType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @ManyToMany(() => Part, (part) => part.types)
  parts: Part[];
}

@Entity()
export class Part {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 200 })
  description: string;

  @ManyToOne(() => Model, (model) => model.parts)
  @JoinColumn()
  model: Model;

  @IsOptional()
  @Column({ type: 'varchar', length: 30, nullable: true })
  partNumber?: string | null;

  @ManyToMany(() => PartType, (pt) => pt.parts)
  @JoinTable()
  types: PartType[];

  @ManyToOne(() => InventoryItem, (invItem) => invItem.part)
  inventoryItems: InventoryItem[];
}
