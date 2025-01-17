import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Inventory {
    @PrimaryGeneratedColumn()
    inventoryID: number;

    @Column()
    parentInventoryID: number; // TODO: foreign key

    @Column()
    organizationID: number; // TODO: foreign key

    @Column() // TODO: not null and set max chars
    name: string;

    @Column() // TODO: set max chars
    description: string;

    @Column() // TODO: set max chars
    location: string;
}
