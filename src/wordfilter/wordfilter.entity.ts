import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Wordfilter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 16 })
  badWord: string;

  @Column({ type: 'varchar', length: 32, default: 'fudge' })
  replacement: string;
}
