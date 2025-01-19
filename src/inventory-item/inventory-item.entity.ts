import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class InventoryItem {
    @PrimaryGeneratedColumn()
    inventoryItemID: number;

    @Column({ nullable: false }) // TODO: set foreign key on part
    partID: number;
    
    @Column({ nullable: false }) // TODO: set foreign key on model
    modelID: number;

    @Column({ nullable: false }) // TODO: set foreign key on inventory
    inventoryID: number;

    @Column({ default: 0 })
    quantity: number;

    @Column({ default: 0 })
    publicCount: number; 

    @Column({ type: "varchar", length: 4000 })
    notes: string;

    @Column({ type: "varchar", length: 4000 })
    attributes: string;

}