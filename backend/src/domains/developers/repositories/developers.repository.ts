import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { DevelopersEntity } from "../entities/developers.entity";

@Injectable()
export class DevelopersRepository extends Repository<DevelopersEntity> {
  constructor(
    private readonly dataSource: DataSource
  ) {
    super(DevelopersEntity, dataSource.createEntityManager())
  }


}