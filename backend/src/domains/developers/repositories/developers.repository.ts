import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { DevelopersEntity } from "../entities/developers.entity";
import { DesenvolvedoresIndexQuery } from "../form-validations/developers.form-validation";
import { DesenvolvedoresIndexPaginatedDto } from "../dtos/developers.dto";

@Injectable()
export class DevelopersRepository extends Repository<DevelopersEntity> {
  constructor(
    private readonly dataSource: DataSource
  ) {
    super(DevelopersEntity, dataSource.createEntityManager())
  }

  async getByQuery(data: DesenvolvedoresIndexQuery): Promise<DesenvolvedoresIndexPaginatedDto> {
    const { nome, sexo, hobby, nivel, current_page, per_page } = data;

    const qb = this.createQueryBuilder('desenvolvedores')
      .leftJoinAndSelect('desenvolvedores.nivel', 'nivel');

    if (nome) {
      qb.andWhere('unaccent(desenvolvedores.nome) ILIKE unaccent(:nome)', { nome: `%${nome}%` })
    }
    if (sexo) {
      qb.andWhere('unaccent(desenvolvedores.sexo) ILIKE unaccent(:sexo)', { sexo: `%${sexo}%` })
    }
    if (hobby) {
      qb.andWhere('unaccent(desenvolvedores.hobby) ILIKE unaccent(:hobby)', { hobby: `%${hobby}%` })
    }
    if (nivel) {
      qb.andWhere('unaccent(nivel.nivel) ILIKE unaccent(:nivel)', { nivel: `%${nivel}%` })
    }

    qb.orderBy('desenvolvedores.id')
      .take(Number(per_page))
      .skip((Number(current_page) - 1) * Number(per_page));

    const [developers, total] = await qb.getManyAndCount();

    const payload = developers.map((dev) => {
      return {
        id: dev.id,
        nome: dev.nome,
        sexo: dev.sexo,
        data_nascimento: dev.data_nascimento,
        hobby: dev.hobby,
        nivel: {
          id: dev.nivel.id,
          nivel: dev.nivel.nivel,
        }
      }
    });

    return {
      data: payload,
      current_page,
      per_page,
      total,
      last_page: Math.ceil(total / per_page),
    };
  }

  async getLevelsPerDev() {
    const result = await this.createQueryBuilder('desenvolvedores')
      .select('desenvolvedores.nivel.id', 'nivel_id')
      .addSelect('COUNT(desenvolvedores.id)', 'dev_count')
      .groupBy('desenvolvedores.nivel.id')
      .getRawMany();

    return result;
  }

}