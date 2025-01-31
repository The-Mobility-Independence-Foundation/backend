import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Wordfilter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  badWord: string;

  @Column({ default: () => '********' })
  replacement: string;
}
