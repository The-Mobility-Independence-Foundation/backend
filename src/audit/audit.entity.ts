import { User } from '../user/user.entity';
import { Organization } from '../organization/organization.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum AuditAction {
  CREATED = 'created',
  MODIFIED = 'modified',
  DELETED = 'deleted',
}

export enum AuditEntity {
  LISTING = 'listing',
  INVENTORY = 'inventory',
  ORDER = 'order',
  TAG = 'tag',
  INVENTORY_ITEM = 'inventory-item',
}

@Entity()
export class Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Organization, (org) => org.audits)
  @JoinColumn()
  organization: Organization;

  @ManyToOne(() => User, (user) => user.audits)
  @JoinColumn()
  user: User;

  @Column({ type: 'enum', enum: AuditAction })
  action: AuditAction;

  @Column({ type: 'enum', enum: AuditEntity })
  entity: AuditEntity;

  @Column()
  entityId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  before: object | null;

  @Column({ type: 'jsonb', nullable: true })
  after: object | null;
}
