import { Inventory } from 'src/inventory/inventory.entity';
import { Invite } from 'src/invite/invite.entity';
import { Order } from 'src/order/order.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class Organization {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(type => Inventory, inventory => inventory.organization)
    inventories: Inventory[];

    @JoinColumn()
    @OneToOne(type => User, owner => owner.organization) // make unique eventually??
    owner: User;

    // returns a 500 server error unless we catch the duplicate name error ourselves. 
    // organizationID will still increment if a unique name is sent though, leaving us with blank rows
    @Column({ type: "varchar", length: 50 })
    name: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    lastActivity: Date;

    @Column({ default: false })
    inactive: boolean;

    @Column({ type: "varchar", length: 4000, default: "" })
    services: string;

    @Column({ type: 'decimal', default: 0.0 })
    rating: number;

    @Column({ type: 'varchar', length: 50 })
    address1: string;

    @Column({ type: 'varchar', length: 50, default: "" })
    address2: string;

    @Column({ type: 'varchar', length: 30 })
    city: string;

    @Column({ type: 'varchar', length: 15 })
    state: string;

    @Column({ type: "varchar", length: 10 })
    zipcode: number;

    @Column({ type: 'varchar', length: 20, nullable: true })
    phoneNumber: string;

    @Column({ type: "varchar", length: 10 })
    ein: String;

    @Column({ type: "varchar", length: 50, array: true, nullable: true })
    socials: string[];

    @OneToMany(type => User, user => user.organization)
    members: User[];

    @OneToMany(type => Order, order => order.owner)
    orders: Order[];

    @OneToMany(type => Invite, invite => invite.organization)
    sentInvites: Invite[];
}