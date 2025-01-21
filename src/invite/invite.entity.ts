import { Organization } from 'src/organization/organization.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';

export enum InviteType {
    SITE = "site", 
    ORGANIZATION = "organization"
}

@Entity()
export class Invite {

    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn() 
    @ManyToOne(() => User, user => user.sentInvites)
    sender: User;

    @JoinColumn() 
    @ManyToOne(() => Organization, org => org.sentInvites)
    organization: Organization;

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