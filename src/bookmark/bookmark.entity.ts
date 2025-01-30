import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false }) // TODO: foreign key on user
  user: number;

  @Column({ nullable: false }) // TODO: foreign key on listing
  listing: number;
}
