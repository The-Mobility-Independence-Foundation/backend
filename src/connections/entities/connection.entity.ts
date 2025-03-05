import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
@Index(['followerId', 'followingId'], { unique: true })
export class Connection {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.following, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'followerId' })
  follower: User;

  @Column()
  followerId: number;

  @ManyToOne(() => User, (user) => user.followers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'followingId' })
  following: User;

  @Column()
  followingId: number;

  @CreateDateColumn()
  createdAt: Date;
}
