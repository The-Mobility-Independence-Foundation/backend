import { InventoryItem } from './inventory-item/inventory-item.entity';
import { Organization } from '../organization/organization.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class Inventory {
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn()
    @ManyToOne(() => Organization, organization => organization.inventories)
    organization: Organization;

    @Column({ type: "varchar", length: 40 })
    name: string;

    @Column({ type: "varchar", length: 4000 })
    description: string;

    @Column({ type: 'varchar', length: 100 })
    addressLine1: string;

    @Column({ type: 'varchar', length: 100, default: "" })
    addressLine2: string;

    @Column({ type: 'varchar', length: 30 })
    city: string;

    @Column({ type: 'varchar', length: 15 })
    state: string;

    @Column({ type: "varchar", length: 10 })
    zipcode: number;

    @OneToMany(() => InventoryItem, item => item.inventory)
    items: InventoryItem[];

}
