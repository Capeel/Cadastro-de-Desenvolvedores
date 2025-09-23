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
  })

  it('should delete a level successfully', async () => {
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

  it('should return an error on trying to delete a level existent on a developer', async () => {
    const levelsRepository = dataSource.getRepository(LevelsEntity);
    const levelJunior = await levelsRepository.findOneByOrFail({ nivel: 'Junior' });

    const response = await request(app.getHttpServer())
      .delete(`/levels/${levelJunior.id}`)
      .expect(400)

    expect(response.body.message).toEqual("Nível já está vinculado a um Desenvolvedor");
  })

  //Testes de Developers

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

  it('should create a developer successfully', async () => {
    const levelsRepository = dataSource.getRepository(LevelsEntity);
    const levelPleno = await levelsRepository.findOneByOrFail({ nivel: 'Pleno' });

    const newDeveloper = {
      nivel: { id: levelPleno.id },
      nome: 'Roberto',
      sexo: 'Masculino',
      data_nascimento: '1989-05-04',
      hobby: 'Futebol'
    };

    const response = await request(app.getHttpServer())
      .post('/developers/create')
      .send(newDeveloper)
      .expect(201);

    expect(response.body.nome).toEqual(newDeveloper.nome)
  });

  it('should return an error if nivel does not exist', async () => {

    const newDeveloper = {
      nivel: { id: 999 },
      nome: 'Roberto',
      sexo: 'Masculino',
      data_nascimento: '1989-05-04',
      hobby: 'Futebol'
    };

    const response = await request(app.getHttpServer())
      .post('/developers/create')
      .send(newDeveloper)
      .expect(400);

    expect(response.body.message).toEqual("Nível não encontrado")
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

  it('should delete a developer successfully', async () => {

    const levelsRepository = dataSource.getRepository(LevelsEntity);
    const levelPleno = await levelsRepository.findOneByOrFail({ nivel: 'Junior' });

    const newDeveloper = {
      nivel: { id: levelPleno.id },
      nome: 'Carlos',
      sexo: 'Masculino',
      data_nascimento: '1999-07-02',
      hobby: 'Basquete'
    };

    const newDeveloperResponse = await request(app.getHttpServer())
      .post('/developers/create')
      .send(newDeveloper)
      .expect(201);

    const developerId = newDeveloperResponse.body.id;

    await request(app.getHttpServer())
      .delete(`/developers/${developerId}`)
      .expect(200)
  });





});