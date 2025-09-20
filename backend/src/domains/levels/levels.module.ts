import { Module } from "@nestjs/common";
import { LevelsEntity } from "./entities/levels.entity";
import { LevelsService } from "./services/levels.service";
import { LevelsRepository } from "./repositories/levels.repository";
import { LevelsController } from "./controllers/levels.controller";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([LevelsEntity])],
    controllers: [LevelsController],
    providers: [LevelsService, LevelsRepository],
    exports: [],
})

export class LevelsModule { }