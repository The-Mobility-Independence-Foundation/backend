import { InventoryItem } from 'src/inventory-item/inventory-item.entity';
import { Order } from 'src/order/order.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';

export enum ListingStatus {
    ACTIVE = "active", 
    INACTIVE = "inactive",
    COMPLETE = "complete",
    ARCHIVED = "archived"
}

@Entity()
export class Listing {
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn()
    @ManyToOne(type => InventoryItem, invItem => invItem.listings)
    inventoryItem: InventoryItem;

    @JoinColumn()
    @ManyToOne(type => User, user => user.listings)
    owner: User;

    @Column({ type: "varchar", length: 40 })
    name: string;

    @Column({ type: "varchar", length: 4000 })
    description: string;

    @Column({ type: "varchar", length: 4000 })
    attributes: string;

    @Column({ default: 1 })
    quantity: number;

    // TODO: research to see if theres a better way to handle location
    @Column({ type: "float", nullable: false })
    latitude: number;

    @Column({ type: "float", nullable: false })
    longitude: number;

    @Column({ default: false })
    inactive: boolean;

    @Column({ type: "varchar", length: 10 })
    zipcode: String;

    @Column({ type: "enum", enum: ListingStatus, default: ListingStatus.ACTIVE})
    state: ListingStatus;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @OneToMany(type => Order, order => order.owner)
    orders: Order[];

}