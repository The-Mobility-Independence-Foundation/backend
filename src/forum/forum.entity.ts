import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn} from 'typeorm';
import { Prefix } from '../prefix/prefix.entity';
import { Post } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';



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
    childForum: Forum[];

    @OneToMany(() => Prefix, prefix => prefix.forumsUsed)
    prefixes: Prefix[];

    @OneToMany(() => Post, (post) => post.forum) 
    posts: Post[];

    @OneToMany(() => Comment, (comment) => comment.forum)  // One user can have many posts
    comments: Comment[];
}