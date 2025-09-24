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
    })

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

});