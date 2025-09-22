import { DataSource, EntityManager, Repository } from "typeorm";
import { LevelsService } from "./levels.service";
import { LevelsEntity } from "../entities/levels.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { LevelsRepository } from "../repositories/levels.repository";


describe('LevelsSerivce', () => {
    let service: LevelsService;
    let repository: jest.Mocked<Repository<LevelsEntity>>

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LevelsService,
                LevelsRepository,
                {
                    provide: getRepositoryToken(LevelsEntity),
                    useValue: {
                        find: jest.fn(),
                        findOne: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                        delete: jest.fn(),
                    },
                },
                {
                    provide: DataSource,
                    useValue: {
                        createEntityManager: jest.fn().mockReturnValue({
                            // Mock básico do EntityManager
                            find: jest.fn(),
                            findOne: jest.fn(),
                            save: jest.fn(),
                            remove: jest.fn(),
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get<LevelsService>(LevelsService);
        repository = module.get(getRepositoryToken(LevelsEntity));
    });

    it('deve retornar todos os niveis', async () => {
        repository.find.mockResolvedValue([
            { id: 1, nivel: "Junior" } as LevelsEntity,
            { id: 2, nivel: "Pleno" } as LevelsEntity,
        ]);
        const result = await service.getAllNiveis();
        expect(result).toEqual([
            { id: 1, nivel: "Junior" },
            { id: 2, nivel: "Pleno" },
        ]);
        expect(repository.find).toHaveBeenCalled();
    });

    // it('deve retornar array vazio se não houver cadastros', async () => {
    //     repository.find.mockResolvedValue([]);

    //     const result = await service.getAllNiveis();

    //     expect(result).toEqual([]);
    //     expect(repository.find).toHaveBeenCalled();
    // });

})