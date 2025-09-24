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

  it('should return all developers successfully', async () => {
    const response = await request(app.getHttpServer())
      .get('/developers/index?current_page=1&per_page=10')
      .expect(200);

    expect(response.body.data[0].nome).toEqual("Gabriel");
    expect(response.body.data[1].nome).toEqual("Vivian");
    expect(response.body.data.length).toEqual(2);
  });

  it('should return only developer level Junior', async () => {
    const response = await request(app.getHttpServer())
      .get('/developers/index?current_page=1&per_page=10&nivel=Junior')
      .expect(200);

    expect(response.body.data[0].nivel.nivel).toEqual("Junior");
    expect(response.body.data.length).toEqual(1);
  });

  it('should return only developer name Vivian', async () => {
    const response = await request(app.getHttpServer())
      .get('/developers/index?current_page=1&per_page=10&nome=Vivian')
      .expect(200);

    expect(response.body.data[0].nome).toEqual("Vivian");
    expect(response.body.data.length).toEqual(1);
  });

  it('should return only developer gender Masculino', async () => {
    const response = await request(app.getHttpServer())
      .get('/developers/index?current_page=1&per_page=10&sexo=Masculino')
      .expect(200);

    expect(response.body.data[0].sexo).toEqual("Masculino");
    expect(response.body.data.length).toEqual(1);
  });

  it('should return only developer hobby Series', async () => {
    const response = await request(app.getHttpServer())
      .get('/developers/index?current_page=1&per_page=10&hobby=Series')
      .expect(200);

    expect(response.body.data[0].hobby).toEqual("Series");
    expect(response.body.data.length).toEqual(1);
  });

  it('should not return any values', async () => {
    const response = await request(app.getHttpServer())
      .get('/developers/index?current_page=1&per_page=10&hobby=Hockei')
      .expect(200);

    expect(response.body.data.length).toEqual(0);
  });

});