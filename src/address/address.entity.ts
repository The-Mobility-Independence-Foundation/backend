import { Inventory } from "../inventory/inventory.entity";
import { Organization } from "../organization/organization.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  addressLine1: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  addressLine2: string;

  @Column({ type: 'varchar', length: 30 })
  city: string;

  @Column({ type: 'varchar', length: 15 })
  state: string;

  @Column({ type: 'varchar', length: 10 })
  zipCode: string;

  @OneToMany(() => Inventory, (inventory) => inventory.address)
  inventories: Inventory[];

  @OneToMany(() => Organization, (org) => org.address)
  organizations: Organization[];
}