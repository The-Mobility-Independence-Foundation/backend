import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum OrderStatus {
    INITIATED = "initiated", 
    PENDING = "pending",
    FULFILLED = "fulfilled", 
    VOIDED = "voided"
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false }) // TODO: set foreign key on listing
    listing: number;

    @Column({ nullable: false }) // TODO: set foreign key on organization
    owner: number;

    @Column({ nullable: false }) // TODO: set foreign key on user
    recipient: number;

    @Column()
    quantity: number;

    @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    dateCreated: Date;

    @Column({ type: "timestamp", nullable: true, default: null })
    dateCompleted: Date;

}