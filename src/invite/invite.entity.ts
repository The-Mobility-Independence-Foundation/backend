import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum InviteType {
    SITE = "site", 
    ORGANIZATION = "organization"
}

@Entity()
export class Invite {

    @PrimaryGeneratedColumn()
    inviteID: number

    @Column() // TODO: foreign key on user
    senderID: number

    @Column() // TODO: foreign key on organization
    organizationID: number

    @Column({ type: "varchar", length: 32 })
    recieverEmail: string

    @Column({ type: "varchar", length: 4000 })
    description: string

    @Column({ type: "enum", enum: InviteType, default: InviteType.ORGANIZATION })
    invType: InviteType

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    sentOn: number

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP + INTERVAL '14 day'" }) // TODO: make it set expiry date properly
    expiresOn: number

    @Column({ type: "timestamp", nullable: true, default: null })
    acceptedOn: number
}