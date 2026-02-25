import { User } from '../user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Index,
  DeleteDateColumn,
} from 'typeorm';

export enum AttachmentEntityType {
  POST = 'post',
  COMMENT = 'comment',
  LISTING = 'listing',
  MESSAGE = 'message',
}

@Entity()
@Index(['entityId', 'entityType'])
@Index(['authorId'])
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'authorId' })
  @ManyToOne(() => User, (user) => user.attachmentsCreated)
  author: User;

  @Column()
  authorId: number;

  @Column()
  entityId: number;

  @Column({
    type: 'enum',
    enum: AttachmentEntityType,
  })
  entityType: AttachmentEntityType;

  @Column({ type: 'text' })
  fileName: string;

  @Column({ type: 'text' })
  fileSize: string;

  @Column({ type: 'text' })
  mimeType: string;

  @Column({ type: 'text' })
  key: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
