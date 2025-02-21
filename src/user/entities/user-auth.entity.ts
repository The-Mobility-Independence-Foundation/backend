import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum AuthType {
  LOCAL = 'local',
  GOOGLE = 'google',
  OUTLOOK = 'outlook',
}

@Entity()
export class UserAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.auth)
  user: User;

  @Column({ type: 'enum', enum: AuthType })
  type: AuthType;

  @Column({ type: 'varchar', length: 255 })
  identifier: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  credentials: string | null;

  // determine what this is
  @Column({ type: 'varchar', length: 255, nullable: true })
  providerAccountId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshToken: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  accessToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  accessTokenExpiresAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
