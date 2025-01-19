import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Inventory {
    @PrimaryGeneratedColumn()
    inventoryID: number;

    @Column()
    parentInventoryID: number; // TODO: foreign key

    @Column()
    organizationID: number; // TODO: foreign key

    @Column({ type: "varchar", length: 40 })
    name: string;

    @Column({ type: "varchar", length: 4000 })
    description: string;

    @Column({ type: "varchar", length: 100 }) 
    location: string;
}
