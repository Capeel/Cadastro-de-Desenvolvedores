import { BadRequestException, Injectable } from "@nestjs/common";
import { DevelopersRepository } from "../repositories/developers.repository";
import { DesenvolvedoresFormCreate, DesenvolvedoresFormUpdate, DesenvolvedoresIndexQuery } from "../form-validations/developers.form-validation";
import { DesenvolvedoresDataDto, DesenvolvedoresIndexPaginatedDto } from "../dtos/developers.dto";
import { LevelsService } from "src/domains/levels/services/levels.service";

@Injectable()
export class DevelopersService {
  constructor(
    private readonly developersRepository: DevelopersRepository,
    private readonly levelsService: LevelsService
  ) { }

  async getAllByQuery(data: DesenvolvedoresIndexQuery): Promise<DesenvolvedoresIndexPaginatedDto> {
    return await this.developersRepository.getByQuery(data);
  }

  async getAll() {
    return await this.developersRepository.find({
      relations: ['nivel']
    });
  }

  async getLevelsPerDev() {
    return await this.developersRepository.getLevelsPerDev();
  }

  async saveDevelopers(data: DesenvolvedoresFormCreate): Promise<DesenvolvedoresDataDto> {

    const level = await this.levelsService.findById(data.nivel.id);

    if (!level) {
      throw new BadRequestException("Nível não encontrado");
    }

    const developer = this.developersRepository.create({
      ...data,
      nivel: { id: data.nivel.id }
    });

    return this.developersRepository.save(developer);

  }

  async editDevelopers(id: number, data: DesenvolvedoresFormUpdate): Promise<DesenvolvedoresDataDto> {

    const developer = await this.developersRepository.findOne({
      where: { id },
      relations: ['nivel'],
    });

    if (!developer) {
      throw new BadRequestException("Desenvolvedor não encontrado");
    }

    if (data.nivel.id) {
      const level = await this.levelsService.findById(data.nivel.id);
      if (!level) {
        throw new BadRequestException("Nível não encontrado");
      }
      developer.nivel = level;
    }

    Object.assign(developer, {
      ...data,
      nivel: developer.nivel,
    });

    return this.developersRepository.save(developer);

  }

  async deleteDeveloper(id: number) {
    const developer = await this.developersRepository.findOneBy({ id });

    if (!developer) {
      throw new BadRequestException("Desenvolvedor não encontrado");
    }

    return await this.developersRepository.delete(id);
  }


}