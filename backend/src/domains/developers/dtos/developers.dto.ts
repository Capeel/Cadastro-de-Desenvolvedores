import { ApiProperty } from "@nestjs/swagger";
export class NivelDataDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Junior' })
  nivel: string;
}
export class DesenvolvedoresDataDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ type: NivelDataDto })
  nivel: NivelDataDto;
  @ApiProperty({ example: "João" })
  nome: string;
  @ApiProperty({ example: "Masculino" })
  sexo: string;
  @ApiProperty({ example: "1995-11-05" })
  data_nascimento: Date;
  @ApiProperty({ example: "Futebol Americano" })
  hobby: string;
}

export class DesenvolvedoresIndexPaginatedDto {
  @ApiProperty({ type: [DesenvolvedoresDataDto] })
  data: DesenvolvedoresDataDto[];
  @ApiProperty({ example: 10 })
  per_page: number;
  @ApiProperty({ example: 1 })
  current_page: number;
  @ApiProperty({ example: 2 })
  last_page: number;
  @ApiProperty({ example: 20 })
  total: number;
}

export class TotalDesenvolvedoresPorNivelDto {
  @ApiProperty({ example: 1 })
  nivel_id: number;

  @ApiProperty({ example: 3 })
  dev_count: number;
}


export class DesenvolvedoresCreateDto {
  @ApiProperty({ type: NivelDataDto })
  nivel: NivelDataDto;
  @ApiProperty({ example: "João" })
  nome: string;
  @ApiProperty({ example: "Masculino" })
  sexo: string;
  @ApiProperty({ example: "1995-11-05" })
  data_nascimento: Date;
  @ApiProperty({ example: "Futebol Americano" })
  hobby: string;
}

export class DesenvolvedoresUpdateDto {
  @ApiProperty({ type: NivelDataDto })
  nivel: NivelDataDto;
  @ApiProperty({ example: "João" })
  nome: string;
  @ApiProperty({ example: "Masculino" })
  sexo: string;
  @ApiProperty({ example: "1995-11-05" })
  data_nascimento: Date;
  @ApiProperty({ example: "Futebol Americano" })
  hobby: string;
}