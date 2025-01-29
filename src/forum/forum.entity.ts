import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany} from 'typeorm';

@Entity()
export class Forum {

    @PrimaryGeneratedColumn()
    id: number;

    @Column() 
    @ManyToOne((type) => Forum, (forum) => forum.childForum, {nullable: true})
    parentForum: Forum | null;

    @Column({type: "varchar",length: 80, nullable: false })
    name: string;

    @Column({type: "varchar", length: 8000})
    description: string;

    @Column({default: false})
    isCategory: boolean;

    @Column()
    order: number;

    @Column({default: false})
    isLocked: boolean;

    @Column()
    numberOfPosts: number;

    @Column()
    numberOfThreads: number;

    @OneToMany((type) => Forum, (forum) => forum.parentForum)
    childForum: Forum[]
}