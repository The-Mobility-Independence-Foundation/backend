import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Part } from '../part/part.entity';
import { InventoryItem } from '../inventory-item/inventory-item.entity';

@Entity()
export class ModelType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @ManyToMany(() => Model, (model) => model.types)
  models: Model[];
}

@Entity()
export class Manufacturer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @OneToMany(() => Model, (model) => model.manufacturer)
  models: Model[];
}

@Entity()
export class Model {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'manufacturerId' })
  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.models)
  @JoinColumn()
  manufacturer: Manufacturer;

  @Column()
  manufacturerId: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column()
  year: number;

  @ManyToMany(() => ModelType, (type) => type.models)
  @JoinTable()
  types: ModelType[];

  @OneToMany(() => InventoryItem, (item) => item.model)
  inventoryItems: InventoryItem[];

  @OneToMany(() => Part, (part) => part.model)
  parts: Part[];
}
