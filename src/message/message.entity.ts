import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false }) // TODO: foreign key on user
    sender: number;

    @Column({ nullable: false }) // TODO: foreign key on conversation
    conversation: number;

    @Column({ type: "varchar", length: 4000 })
    messageContent: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    readStatus: Date;

}