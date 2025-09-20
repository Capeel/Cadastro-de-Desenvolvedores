import { LevelsEntity } from "src/domains/levels/entities/levels.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  schema: 'public',
  name: 'desenvolvedores',
  synchronize: false
})

export class DevelopersEntity extends BaseEntity {

  @PrimaryGeneratedColumn('increment', {
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(() => LevelsEntity)
  @JoinColumn({ name: 'nivel_id' })
  nivel: LevelsEntity;

  @Column({
    type: 'varchar',
    name: 'nome'
  })
  nome: string;

  @Column({
    type: 'varchar',
    name: 'sexo'
  })
  sexo: string;

  @Column({
    type: 'timestamp',
    name: 'data_nascimento'
  })
  data_nascimento: Date;

  @Column({
    type: 'varchar',
    name: 'hobby'
  })
  hobby: string;

}