import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { InventoryItem } from '../inventory-item.entity';

@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 32 })
    name: String;

    @Column({ default: 1 })
    uses: Number;

    @ManyToMany(() => InventoryItem, item => item.tags)
    inventoryItems: InventoryItem[];
}