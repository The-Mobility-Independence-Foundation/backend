import { Organization } from 'src/organization/organization.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Inventory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    parentInventory: number; // TODO: foreign key

    @JoinColumn()
    @ManyToOne(type => Organization, organization => organization.inventories)
    organization: Organization;

    @Column({ type: "varchar", length: 40 })
    name: string;

    @Column({ type: "varchar", length: 4000 })
    description: string;

    @Column({ type: "varchar", length: 100 }) 
    location: string;
}
