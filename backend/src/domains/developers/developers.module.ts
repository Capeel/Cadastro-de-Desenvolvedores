import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DevelopersEntity } from "./entities/developers.entity";
import { DevelopersController } from "./controllers/developers.controller";
import { DevelopersService } from "./services/developers.service";
import { DevelopersRepository } from "./repositories/developers.repository";
import { LevelsModule } from "../levels/levels.module";

@Module({
  imports: [TypeOrmModule.forFeature([DevelopersEntity]), LevelsModule],
  controllers: [DevelopersController],
  providers: [DevelopersService, DevelopersRepository],
  exports: [],
})

export class DevelopersModule { }