import { Listing } from 'src/listing/listing.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class InventoryItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false }) // TODO: set foreign key on part
    part: number;
    
    @Column({ nullable: false }) // TODO: set foreign key on model
    model: number;

    @Column({ nullable: false }) // TODO: set foreign key on inventory
    inventory: number;

    @Column({ default: 0 })
    quantity: number;

    @Column({ default: 0 })
    publicCount: number; 

    @Column({ type: "varchar", length: 4000 })
    notes: string;

    @Column({ type: "varchar", length: 4000 })
    attributes: string;

    @OneToMany(type => Listing, listing => listing.inventoryItem)
    listings: Listing[];

}