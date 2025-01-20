import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum InviteType {
    SITE = "site", 
    ORGANIZATION = "organization"
}

@Entity()
export class Invite {

    @PrimaryGeneratedColumn()
    id: number;

    @Column() // TODO: foreign key on user
    sender: number;

    @Column() // TODO: foreign key on organization
    organization: number;

    @Column({ type: "varchar", length: 32 })
    recieverEmail: string;

    @Column({ type: "varchar", length: 4000 })
    description: string;

    @Column({ type: "enum", enum: InviteType, default: InviteType.ORGANIZATION })
    invType: InviteType;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    sentOn: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP + INTERVAL '14 day'" }) // TODO: make it set expiry date properly
    expiresOn: Date;

    @Column({ type: "timestamp", nullable: true, default: null })
    acceptedOn: Date;
}