import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bookmark {

    @PrimaryGeneratedColumn()
    bookmarkID: number;

    @Column({ nullable: false }) // TODO: foreign key on user
    userID: number;

    @Column({ nullable: false }) // TODO: foreign key on listing
    listingID: number;

}