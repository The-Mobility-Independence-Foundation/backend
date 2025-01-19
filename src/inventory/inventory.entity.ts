import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Inventory {
    @PrimaryGeneratedColumn()
    inventoryID: number;

    @Column()
    parentInventoryID: number; // TODO: foreign key

    @Column()
    organizationID: number; // TODO: foreign key

    @Column({ type: "varchar", length: 40 }) // TODO: not null and set max chars
    name: string;

    @Column({ type: "varchar", length: 4000 }) // TODO: set max chars
    description: string;

    @Column({ type: "varchar", length: 100 }) // TODO: set max chars
    location: string;
}
