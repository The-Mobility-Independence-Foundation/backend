import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Model } from "../model/model.entity";

@Entity()
export class PartType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 20 })
    name: String;

    @ManyToMany(() => Part, part => part.types)
    parts: Part[];
    
}

@Entity()
export class Part {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 50 })
    name: String;

    @Column({ type: "varchar", length: 200 })
    description: String;

    @ManyToOne(() => Model, model => model.parts)
    @JoinColumn()
    model: Model;

    @Column({ type: "varchar", length: 30 })
    partNumber: String;

    @ManyToMany(() => PartType, pt => pt.parts)
    @JoinTable()
    types: PartType[];
    
}