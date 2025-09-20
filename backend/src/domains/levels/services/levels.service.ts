import { BadRequestException, Injectable } from "@nestjs/common";
import { LevelsRepository } from "../repositories/levels.repository";
import { LevelFormCreate, LevelFormUpdate, LevelIndexQuery } from "../form-validations/levels.form-validations"
import { LevelDataDto, LevelIndexPaginatedDto } from "../dtos/level.dto"

@Injectable()
export class LevelsService {
  constructor(
    private readonly levelsRepository: LevelsRepository,
  ) { }

  async index(data: LevelIndexQuery): Promise<LevelIndexPaginatedDto> {
    return await this.levelsRepository.getAll(data);
  }

  async saveLevel(data: LevelFormCreate): Promise<LevelDataDto> {

    const existLevel = await this.levelsRepository.findOne({
      where: { level: data.level }
    });

    if (existLevel) {
      throw new BadRequestException(`O Nível ${data.level} já existe.`);
    };

    const level = this.levelsRepository.create(data);

    const saved = await this.levelsRepository.save(level);

    return {
      id: saved.id,
      level: saved.level
    };

  }

  async editLevel(id: number, data: LevelFormUpdate): Promise<LevelDataDto> {
    const level = await this.levelsRepository.findOne({
      where: { id }
    });

    if (!level) {
      throw new BadRequestException("Nível não encontrado");
    }

    if (data.level) {
      level.level = data.level;
    };

    const saved = await this.levelsRepository.save(level);

    return {
      id: level.id,
      level: level.level,
    };
  }

  async deleteLevel(id) {
    const level = await this.levelsRepository.findOne({
      where: { id }
    });

    if (!level) {
      throw new BadRequestException("Nível não encontrado");
    }

    await this.levelsRepository.delete(id);
  }


}