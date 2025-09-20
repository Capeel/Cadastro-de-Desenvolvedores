import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  schema: 'public',
  name: 'levels',
  synchronize: false,
})

export class LevelsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'integer',
    name: 'id'
  })
  id: number

  @Column({
    type: 'varchar',
    name: 'level',
  })
  level: string;
}