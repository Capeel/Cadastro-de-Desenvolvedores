import { BadRequestException, Injectable } from "@nestjs/common";
import { DevelopersRepository } from "../repositories/developers.repository";
import { DevelopersFormCreate, DevelopersFormUpdate } from "../form-validations/developers.form-validation";
import { DevelopersDataDto } from "../dtos/developers.dto";
import { LevelsService } from "src/domains/levels/services/levels.service";

@Injectable()
export class DevelopersService {
  constructor(
    private readonly developersRepository: DevelopersRepository,
    private readonly levelsService: LevelsService
  ) { }


  async saveDevelopers(data: DevelopersFormCreate): Promise<DevelopersDataDto> {

    const level = await this.levelsService.findById(data.levelsId);

    if (!level) {
      throw new BadRequestException("Nível não encontrado");
    }

    const developer = this.developersRepository.create({
      ...data,
      levelsId: data.levelsId
    });

    return this.developersRepository.save(developer);

  }

  async editDevelopers(id: number, data: DevelopersFormUpdate): Promise<DevelopersDataDto> {

    const developer = await this.developersRepository.findOneBy({ id });

    if (!developer) {
      throw new BadRequestException("Desenvolvedor não encontrado");
    }

    if (data.levelsId) {
      const level = await this.levelsService.findById(data.levelsId);
      if (!level) {
        throw new BadRequestException("Nível não encontrado");
      }
    }

    Object.assign(developer, data);

    return this.developersRepository.save(developer);

  }


}