import { LevelsEntity } from "src/domains/levels/entities/levels.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  schema: 'public',
  name: 'developers',
  synchronize: false
})

export class DevelopersEntity extends BaseEntity {

  @PrimaryGeneratedColumn('increment', {
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(() => LevelsEntity)
  @JoinColumn({ name: 'levelsId' })
  levels: LevelsEntity;
  @Column()
  levelsId: number;

  @Column({
    type: 'varchar',
    name: 'name'
  })
  name: string;

  @Column({
    type: 'varchar',
    name: 'gender'
  })
  gender: string;

  @Column({
    type: 'timestamp',
    name: 'birthday'
  })
  birthday: Date;

  @Column({
    type: 'varchar',
    name: 'hobby'
  })
  hobby: string;

}