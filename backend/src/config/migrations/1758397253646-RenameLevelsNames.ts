import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameLevelsNames1758397253646 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('levels', 'level', 'nivel')
    await queryRunner.renameTable('levels', 'niveis');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('niveis', 'nivel', 'level')
    await queryRunner.renameTable('niveis', 'levels');
  }

}
