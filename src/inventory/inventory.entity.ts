import { InventoryItem } from 'src/inventory-item/inventory-item.entity';
import { Organization } from 'src/organization/organization.entity';
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

    @Column({ type: "varchar", length: 100 }) 
    location: string;

    @OneToMany(() => InventoryItem, item => item.inventory)
    items: InventoryItem[];

}
