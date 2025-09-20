import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { LevelsEntity } from "../entities/levels.entity";
import { NiveisIndexQuery } from "../form-validations/levels.form-validations";
import { NiveisIndexPaginatedDto } from "../dtos/level.dto";

@Injectable()
export class LevelsRepository extends Repository<LevelsEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(LevelsEntity, dataSource.createEntityManager());
  }

  async getAll(data: NiveisIndexQuery): Promise<NiveisIndexPaginatedDto> {
    const { current_page, per_page, nivel } = data;

    const qb = this.createQueryBuilder('niveis');

    if (nivel) {
      qb.andWhere('unaccent(niveis.nivel) ILIKE unaccent(:nivel)', { nivel: `%${nivel}%` })
    }

    qb.orderBy('niveis.id')
      .take(Number(per_page))
      .skip((Number(current_page) - 1) * Number(per_page))

    const [levels, total] = await qb.getManyAndCount();

    const payload = levels.map((level) => {
      return {
        id: level.id,
        nivel: level.nivel,
      }
    });

    return {
      data: payload,
      current_page,
      per_page,
      total,
      last_page: Math.ceil(total / per_page)
    };
  }

  async findRelations(id: number): Promise<boolean> {
    const existRelation = this.manager.getRepository('desenvolvedores')
      .createQueryBuilder('dev')
      .where('dev.nivel_id = :id', { id })
      .getExists();

    return existRelation;
  }
}