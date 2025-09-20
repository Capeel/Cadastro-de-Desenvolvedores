import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameDevelopersTable1758397510738 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('developers', 'levelsId', 'nivel_id')
    await queryRunner.renameColumn('developers', 'name', 'nome')
    await queryRunner.renameColumn('developers', 'gender', 'sexo')
    await queryRunner.renameColumn('developers', 'birthday', 'data_nascimento')
    await queryRunner.renameTable('developers', 'desenvolvedores')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('desenvolvedores', 'nivel_id', 'levelsId')
    await queryRunner.renameColumn('desenvolvedores', 'nome', 'name')
    await queryRunner.renameColumn('desenvolvedores', 'sexo', 'gender')
    await queryRunner.renameColumn('desenvolvedores', 'data_nascimento', 'birthday')
    await queryRunner.renameTable('desenvolvedores', 'developers')
  }

}
