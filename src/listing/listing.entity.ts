import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum ListingStatus {
    ACTIVE = "active", 
    INACTIVE = "inactive",
    COMPLETE = "complete",
    ARCHIVED = "archived"
}

@Entity()
export class Listing {
    @PrimaryGeneratedColumn()
    listingID: number;

    @Column({ nullable: false }) // TODO: set foreign key on inventoryItem
    inventoryItemID: number;

    @Column({ nullable: false }) // TODO: set foreign key on user
    userID: number;

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

    @Column()
    zipcode: number;

    @Column({ type: "enum", enum: ListingStatus, default: ListingStatus.ACTIVE})
    state: ListingStatus;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: number;
}