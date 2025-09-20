import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  schema: 'public',
  name: 'niveis',
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
    name: 'nivel',
  })
  nivel: string;
}