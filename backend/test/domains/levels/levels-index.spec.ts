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
      .get('/niveis/index?current_page=1&per_page=10')
      .expect(200);

    expect(response.body.data[0].nivel).toEqual("Junior");
    expect(response.body.data[1].nivel).toEqual("Pleno");
    expect(response.body.data[2].nivel).toEqual("Senior");
    expect(response.body.data.length).toEqual(3);
  });

  it('should return only junior level', async () => {
    const response = await request(app.getHttpServer())
      .get('/niveis/index?current_page=1&per_page=10&nivel=Junior')
      .expect(200);

    expect(response.body.data[0].nivel).toEqual("Junior");
    expect(response.body.data.length).toEqual(1);
  });

  it('should not return values', async () => {
    const response = await request(app.getHttpServer())
      .get('/niveis/index?current_page=1&per_page=10&nivel=TechLead')
      .expect(200);

    expect(response.body.data.length).toEqual(0);
  });



});