import { User } from '../user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

export enum EntityType {
  POST = 'post',
  COMMENT = 'comment',
  LISTING = 'listing',
  MESSAGE = 'message',
}

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.attachmentsCreated)
  author: User;

  @Column()
  entity_id: number;

  @Column({ type: 'enum', enum: EntityType, default: EntityType.POST })
  entity_type: EntityType;

  @Column({ type: 'varchar', length: 20 })
  file_name: string;

  @Column({ type: 'varchar', length: 15 })
  file_size: string;

  @Column({ type: 'varchar', length: 20 })
  mime_type: string;

  @Column({ type: 'text' })
  storage_url: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
