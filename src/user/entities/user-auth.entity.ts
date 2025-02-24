import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { IsEmail } from '../../common/decorators/user.decorators';
import { UserValidation } from '../../common/validation/user.validation';
import { User } from './user.entity';
import { IsEnum, IsOptional } from 'class-validator';
export enum AuthType {
  LOCAL = 'local',
  GOOGLE = 'google',
  OUTLOOK = 'outlook',
}

@Entity()
export class UserAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.auth, { nullable: false })
  user: User;

  @IsEnum(AuthType)
  @Column({ type: 'enum', enum: AuthType })
  type: AuthType;

  @IsEmail()
  @Index({ unique: true })
  @Column({ type: 'varchar', length: UserValidation.email.max })
  identifier: string;

  @IsOptional()
  @Column({
    type: 'varchar',
    length: UserValidation.password.max,
    nullable: true,
  })
  credentials: string | null = null;

  @IsOptional()
  @Column({ type: 'varchar', length: 255, nullable: true })
  providerAccountId: string | null = null;

  @IsOptional()
  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshToken: string | null = null;

  @IsOptional()
  @Column({ type: 'varchar', length: 255, nullable: true })
  accessToken: string | null = null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
