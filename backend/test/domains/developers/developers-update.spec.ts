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



  it('should update an existing developer', async () => {
    const levelsRepository = dataSource.getRepository(LevelsEntity);
    const levelPleno = await levelsRepository.findOneByOrFail({ nivel: 'Pleno' });
    const levelJunior = await levelsRepository.findOneByOrFail({ nivel: 'Junior' });

    const toBeUpdated = {
      nivel: { id: levelPleno.id },
      nome: 'Jorge',
      sexo: 'Masculino',
      data_nascimento: '1998-05-04',
      hobby: 'Formula 1'
    };
    const createDeveloperResponse = await request(app.getHttpServer())
      .post('/developers/create')
      .send(toBeUpdated)
      .expect(201)

    const developerId = createDeveloperResponse.body.id;

    const updateDeveloper = {
      nivel: { id: levelJunior.id },
      nome: 'Gabriela',
      sexo: 'Feminino',
      data_nascimento: '1998-07-01',
      hobby: 'Pescaria'
    }

    const updatedDeveloperResponse = await request(app.getHttpServer())
      .patch(`/developers/update/${developerId}`)
      .send(updateDeveloper)
      .expect(200)

    expect(updatedDeveloperResponse.body.nome).toEqual(updateDeveloper.nome)
  });


  it('should return an error if developer id not exists', async () => {
    const levelsRepository = dataSource.getRepository(LevelsEntity);
    const levelPleno = await levelsRepository.findOneByOrFail({ nivel: 'Pleno' });
    const developerId = 999;

    const updateDeveloper = {
      nivel: { id: levelPleno.id },
      nome: 'Gabriela',
      sexo: 'Feminino',
      data_nascimento: '1998-07-01',
      hobby: 'Pescaria'
    }

    const response = await request(app.getHttpServer())
      .patch(`/developers/update/${developerId}`)
      .send(updateDeveloper)
      .expect(400)

    expect(response.body.message).toBe("Desenvolvedor não encontrado")
  });

  it('should return an error if nivel id not exists', async () => {
    const levelsRepository = dataSource.getRepository(LevelsEntity);
    const levelPleno = await levelsRepository.findOneByOrFail({ nivel: 'Pleno' });

    const newDeveloper = {
      nivel: { id: levelPleno.id },
      nome: 'Roberto',
      sexo: 'Masculino',
      data_nascimento: '1989-05-04',
      hobby: 'Futebol'
    };

    const newDeveloperResponse = await request(app.getHttpServer())
      .post('/developers/create')
      .send(newDeveloper)
      .expect(201);

    const developerId = newDeveloperResponse.body.id;

    const updateDeveloper = {
      nivel: { id: 999 },
      nome: 'Gabriela',
      sexo: 'Feminino',
      data_nascimento: '1998-07-01',
      hobby: 'Pescaria'
    }

    const response = await request(app.getHttpServer())
      .patch(`/developers/update/${developerId}`)
      .send(updateDeveloper)
      .expect(400)

    expect(response.body.message).toBe("Nível não encontrado")
  });

});