import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelsModule } from '../../../src/domains/levels/levels.module';
import { LevelsEntity } from '../../../src/domains/levels/entities/levels.entity';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { DevelopersEntity } from 'src/domains/developers/entities/developers.entity';
import { DevelopersModule } from 'src/domains/developers/developers.module';

describe('Levels Index Test', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: 6432,
      username: 'postgres',
      password: 'dev123',
      database: 'cadastro_desenvolvedores_test',
      entities: [LevelsEntity, DevelopersEntity],
      migrations: [path.join(__dirname, '../../../src/config/migrations/*.ts')]
    });

    await dataSource.initialize();
    await dataSource.dropDatabase();
    await dataSource.runMigrations();

    const levelsRepository = dataSource.getRepository(LevelsEntity);
    await levelsRepository.save([
      { nivel: 'Junior' },
      { nivel: 'Pleno' },
      { nivel: 'Senior' }
    ]);
    const levelJunior = await levelsRepository.findOneByOrFail({ nivel: 'Junior' });
    const levelSenior = await levelsRepository.findOneByOrFail({ nivel: 'Senior' })

    const developersRepository = dataSource.getRepository(DevelopersEntity);
    await developersRepository.save([
      {
        nivel: levelJunior,
        nome: 'Gabriel',
        sexo: 'Masculino',
        data_nascimento: new Date('1995-11-04'),
        hobby: 'Violao'
      },
      {
        nivel: levelSenior,
        nome: 'Vivian',
        sexo: 'Feminino',
        data_nascimento: new Date('1995-08-02'),
        hobby: 'Series'
      }
    ])

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 6432,
          username: 'postgres',
          password: 'dev123',
          database: 'cadastro_desenvolvedores_test',
          entities: [LevelsEntity, DevelopersEntity],
          synchronize: false
        }),
        LevelsModule,
        DevelopersModule
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    await dataSource.dropDatabase();
    await dataSource.destroy();
  });


  it('should update an existing level', async () => {
    const toBeUpdated = {
      nivel: "Junior A"
    }

    const createLevelResponse = await request(app.getHttpServer())
      .post('/levels/create')
      .send(toBeUpdated)
      .expect(201)

    const levelId = createLevelResponse.body.id;

    const updatedLevel = {
      nivel: "Pleno A"
    }

    const updatedLevelResponse = await request(app.getHttpServer())
      .patch(`/levels/update/${levelId}`)
      .send(updatedLevel)
      .expect(200)

    expect(updatedLevelResponse.body.nivel).toEqual(updatedLevel.nivel)
  })

  it('should return an error if level id not exists', async () => {
    const levelId = 999;

    const updatedLevel = {
      nivel: "Senior A"
    }

    const response = await request(app.getHttpServer())
      .patch(`/levels/update/${levelId}`)
      .send(updatedLevel)
      .expect(400)

    expect(response.body.message).toBe("Nível não encontrado")
  })

  it('should return an error if try to update an level that already exists', async () => {
    const newLevel = {
      nivel: "Teach Lead A"
    }

    const toBeUpdated = {
      nivel: "Senior C"
    }

    await request(app.getHttpServer())
      .post('/levels/create')
      .send(newLevel)
      .expect(201)

    const toBeUpdatedResponse = await request(app.getHttpServer())
      .post('/levels/create')
      .send(toBeUpdated)
      .expect(201)

    const levelId = toBeUpdatedResponse.body.id;

    const updatedLevelResponse = await request(app.getHttpServer())
      .patch(`/levels/update/${levelId}`)
      .send(newLevel)
      .expect(400)

    expect(updatedLevelResponse.body.message).toBe("Nível já existe");
  });

});