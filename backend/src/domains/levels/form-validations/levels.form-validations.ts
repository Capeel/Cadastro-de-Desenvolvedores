/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class NiveisFormCreate {
  @ApiProperty({
    description: "Nome do Nível",
    example: "Junior",
    required: true
  })
  @IsNotEmpty({ message: "Nível deve ser informado" })
  @IsString()
  nivel: string;
}

export class NiveisFormUpdate {
  @ApiProperty({
    description: "Nome do Nível",
    example: "Junior",
    required: false
  })
  @IsOptional()
  @IsString()
  nivel?: string;
}

export class NiveisIndexQuery {
  @ApiProperty({
    description: "Nome do Nível",
    example: "Junior",
    required: false
  })
  @IsOptional()
  nivel?: string;

  @ApiProperty({
    description: "Página atual",
    example: 1,
    required: true
  })
  @IsNotEmpty()
  current_page: number;

  @ApiProperty({
    description: "Quantidade de informção por página",
    example: 10,
    required: true
  })
  @IsNotEmpty()
  per_page: number;
}
