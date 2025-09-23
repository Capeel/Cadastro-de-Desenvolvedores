/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class NiveisFormCreate {
  @IsNotEmpty({ message: "Nível deve ser informado" })
  @IsString()
  nivel: string;
}

export class NiveisFormUpdate {
  @IsOptional()
  @IsString()
  nivel?: string;
}

export class NiveisIndexQuery {
  @IsOptional()
  nivel?: string;

  @IsNotEmpty()
  current_page: number;

  @IsNotEmpty()
  per_page: number;
}
