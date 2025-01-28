import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Wordfilter {

    @PrimaryGeneratedColumn()
    id: number;

    @Column() 
    badWord: String;

    @Column({default: () => "********" })
    replacement: String;
}