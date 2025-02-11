import { Organization } from '../organization/organization.entity';
import { User } from '../user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

export enum InviteType {
  SITE = 'site',
  ORGANIZATION = 'organization',
}

@Entity()
export class Invite {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.sentInvites)
  inviter: User;

  @JoinColumn()
  @ManyToOne(() => Organization, (org) => org.sentInvites)
  organization: Organization;

  @Column({ type: 'varchar', length: 32 })
  inviteeEmail: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'enum', enum: InviteType, default: InviteType.ORGANIZATION })
  type: InviteType;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sentOn: Date;

  @Column({
    type: 'timestamp',
    default: () => "CURRENT_TIMESTAMP + INTERVAL '14 day'",
  }) // TODO: make it set expiry date properly
  expiresOn: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  acceptedOn: Date;
}
