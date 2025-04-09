import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToOne,
} from 'typeorm';
import { IsEmail, IsPassword } from '../../common/decorators/user.decorators';
import { UserValidation } from '../../common/validation/user.validation';
import { User } from './user.entity';
import { IsEnum, IsOptional } from 'class-validator';

export enum AuthType {
  LOCAL = 'local',
  GOOGLE = 'google',
  OUTLOOK = 'outlook',
}

/**
 * A user authentication
 */
@Entity()
export class UserAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.auth)
  user: User;

  @IsEnum(AuthType)
  @Column({ type: 'enum', enum: AuthType, nullable: false })
  type: AuthType;

  @IsEmail()
  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: UserValidation.email.max,
    nullable: false,
  })
  identifier: string;

  @IsOptional()
  @IsPassword()
  @Column({
    type: 'varchar',
    length: UserValidation.password.max,
    nullable: true,
  })
  credentials?: string | null;

  @IsOptional()
  @Column({ type: 'varchar', length: 255, nullable: true })
  providerAccountId?: string | null;

  @IsOptional()
  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshToken?: string | null;

  @IsOptional()
  @Column({ type: 'varchar', length: 255, nullable: true })
  accessToken?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
