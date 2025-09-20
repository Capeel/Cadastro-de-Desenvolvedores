import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { LevelsEntity } from "../entities/levels.entity";
import { LevelIndexQuery } from "../form-validations/levels.form-validations";
import { LevelIndexPaginatedDto } from "../dtos/level.dto";

@Injectable()
export class LevelsRepository extends Repository<LevelsEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(LevelsEntity, dataSource.createEntityManager());
  }

  async getAll(data: LevelIndexQuery): Promise<LevelIndexPaginatedDto> {
    const { currentPage, perPage, level } = data;

    const qb = this.createQueryBuilder('levels');

    if (level) {
      qb.andWhere('unaccent(levels.level) ILIKE unaccent(:level)', { level: `%${level}%` })
    }

    qb.orderBy('levels.id')
      .take(Number(perPage))
      .skip((Number(currentPage) - 1) * Number(perPage))

    const [levels, total] = await qb.getManyAndCount();

    const payload = levels.map((level) => {
      return {
        id: level.id,
        level: level.level,
      }
    });

    return {
      data: payload,
      currentPage,
      perPage,
      total,
      lastPage: Math.ceil(total / perPage)
    };
  }

  async findRelations(id: number): Promise<boolean> {
    const existRelation = this.createQueryBuilder('developers')
      .where('developers.levelsId = :id', { id })
      .getExists();

    return existRelation;
  }
}