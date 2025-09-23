import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelsModule } from '../../../src/domains/levels/levels.module';
import { LevelsEntity } from '../../../src/domains/levels/entities/levels.entity';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

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
      entities: [LevelsEntity],
      migrations: [path.join(__dirname, '../../../src/config/migrations/*.ts')]
    });

    await dataSource.initialize();
    await dataSource.dropDatabase();
    await dataSource.runMigrations();

    const repository = dataSource.getRepository(LevelsEntity);
    await repository.save([
      { nivel: 'Junior' },
      { nivel: 'Pleno' },
      { nivel: 'Senior' }
    ]);

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
          entities: [LevelsEntity],
          synchronize: false
        }),
        LevelsModule,
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

  it('should return all levels successfully', async () => {
    const response = await request(app.getHttpServer())
      .get('/levels/index?current_page=1&per_page=10')
      .expect(200);

    expect(response.body.data[0].nivel).toEqual("Junior");
    expect(response.body.data[1].nivel).toEqual("Pleno");
    expect(response.body.data[2].nivel).toEqual("Senior");
    expect(response.body.data.length).toEqual(3);
  });

  it('should return only junior level', async () => {
    const response = await request(app.getHttpServer())
      .get('/levels/index?current_page=1&per_page=10&nivel=Junior')
      .expect(200);

    expect(response.body.data[0].nivel).toEqual("Junior");
    expect(response.body.data.length).toEqual(1);
  });

  it('should not return values', async () => {
    const response = await request(app.getHttpServer())
      .get('/levels/index?current_page=1&per_page=10&nivel=TechLead')
      .expect(200);

    expect(response.body.data.length).toEqual(0);
  });

  it('should create a new level', async () => {
    const newLevel = {
      nivel: "Tech"
    };

    const response = await request(app.getHttpServer())
      .post('/levels/create')
      .send(newLevel)
      .expect(201);

    expect(response.body.nivel).toEqual(newLevel.nivel);
    expect(response.body.id).toBeDefined();
  });

  it('should return an error if level is empty', async () => {
    const invalidNivel = {
      nivel: ""
    };

    const response = await request(app.getHttpServer())
      .post('/levels/create')
      .send(invalidNivel)
      .expect(400);

    expect(response.body.message).toBe("Nível deve ser informado")
  })

  it('should return and error if level already exist', async () => {
    const newLevel = {
      nivel: "Tech Lead"
    }

    await request(app.getHttpServer())
      .post('/levels/create')
      .send(newLevel)
      .expect(201)

    const duplicateLevelResponse = await request(app.getHttpServer())
      .post('/levels/create')
      .send(newLevel)
      .expect(400)

    expect(duplicateLevelResponse.body.message).toBe(`O Nível já existe.`)
  })

  it('should update an axisting level', async () => {
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

  it('should return and error if try to update an level already existent', async () => {
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
  })

  it('should delete an levels', async () => {
    //Pode dar falha por conta da verificação do Developers( ainda não implementado nos testes)
    const newLevel = {
      nivel: "Junior C"
    }

    const newLevelResponse = await request(app.getHttpServer())
      .post('/levels/create')
      .send(newLevel)
      .expect(201)

    const levelId = newLevelResponse.body.id

    await request(app.getHttpServer())
      .delete(`/levels/${levelId}`)
      .expect(200)
  })




});