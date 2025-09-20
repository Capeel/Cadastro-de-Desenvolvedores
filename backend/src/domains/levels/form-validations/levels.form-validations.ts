/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LevelFormCreate {
  @IsNotEmpty({ message: "Nível deve ser informado" })
  @IsString()
  level: string;
}

export class LevelFormUpdate {
  @IsOptional()
  @IsString()
  level?: string;
}

export class LevelIndexQuery {
  @IsOptional()
  level?: string;

  @IsNotEmpty()
  page: number;

  @IsNotEmpty()
  perPage: number;
}