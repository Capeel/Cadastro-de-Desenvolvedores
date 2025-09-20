import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateDevelopersTable1758388650019 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        schema: 'public',
        name: 'developers',
        columns: [
          { name: 'id', type: 'integer', isPrimary: true, isGenerated: true },
          { name: 'levelsId', type: 'integer' },
          { name: 'name', type: 'varchar' },
          { name: 'gender', type: 'varchar' },
          { name: 'birthday', type: 'timestamp' },
          { name: 'hobby', type: 'varchar' },
        ],
      }),
      true,
    );

    const levelFK = new TableForeignKey({
      columnNames: ['levelsId'],
      referencedTableName: 'public.levels',
      referencedColumnNames: ['id'],
    });

    await queryRunner.createForeignKeys('public.developers', [
      levelFK,
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('public.developers')
  }

}
