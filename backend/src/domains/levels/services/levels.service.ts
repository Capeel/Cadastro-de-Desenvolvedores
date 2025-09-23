import { BadRequestException, Injectable } from "@nestjs/common";
import { LevelsRepository } from "../repositories/levels.repository";
import { NiveisFormCreate, NiveisFormUpdate, NiveisIndexQuery } from "../form-validations/levels.form-validations"
import { NiveisDataDto, NiveisIndexPaginatedDto } from "../dtos/level.dto"
import { Not } from "typeorm";

@Injectable()
export class LevelsService {
  constructor(
    private readonly levelsRepository: LevelsRepository,
  ) { }

  async index(data: NiveisIndexQuery): Promise<NiveisIndexPaginatedDto> {
    return await this.levelsRepository.getAll(data);
  }

  async getAllLevels() {
    return await this.levelsRepository.find();
  }

  async saveLevel(data: NiveisFormCreate): Promise<NiveisDataDto> {

    if (!data.nivel) {
      throw new BadRequestException("Nível deve ser informado");
    }

    const existLevel = await this.levelsRepository.findOne({
      where: { nivel: data.nivel }
    });

    if (existLevel) {
      throw new BadRequestException(`O Nível já existe.`);
    };

    return await this.levelsRepository.save(data);
  }

  async editLevel(id: number, data: NiveisFormUpdate): Promise<NiveisDataDto> {
    const level = await this.levelsRepository.findOne({
      where: { id }
    });

    const existLevel = await this.levelsRepository.findOne({
      where: {
        nivel: data.nivel,
        id: Not(id),
      }
    })

    if (existLevel) {
      throw new BadRequestException(`Nível já existe`);
    }

    if (!level) {
      throw new BadRequestException("Nível não encontrado");
    }

    if (data.nivel) {
      level.nivel = data.nivel;
    };

    const saved = await this.levelsRepository.save(level);

    return {
      id: level.id,
      nivel: level.nivel,
    };
  }

  async deleteLevel(id) {
    const existRelation = await this.levelsRepository.findRelations(id);

    if (existRelation) {
      throw new BadRequestException("Nível já está vinculado a um Desenvolvedor");
    };

    const level = await this.levelsRepository.findOne({
      where: { id }
    });

    if (!level) {
      throw new BadRequestException("Nível não encontrado");
    }

    await this.levelsRepository.delete(id);
  }


}