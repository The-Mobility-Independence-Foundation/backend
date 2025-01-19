import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum RequestStatus {
    PENDING = "pending", 
    ACCEPTED = "accepted",
    DENIED = "denied"
}

@Entity()
export class Request {

    @PrimaryGeneratedColumn()
    requestID: number

    @Column({ nullable: true, default: null }) // TODO: foreign key on user
    approverID: number

    @Column()
    ein: number

    @Column({ type: "varchar", length: 20 })
    firstName: string

    @Column({ type: "varchar", length: 20 })
    lastName: string

    @Column({ type: "varchar", length: 30 })
    email: string

    @Column({ type: "varchar", length: 4000 })
    description: string

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    sentOn: number

    @Column({ type: "timestamp", nullable: true, default: null })
    actionTakenOn: number 

    @Column({ type: "enum", enum: RequestStatus, default: RequestStatus.PENDING })
    status: RequestStatus

}