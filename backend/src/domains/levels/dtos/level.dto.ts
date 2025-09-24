import { ApiProperty } from "@nestjs/swagger";

export class NiveisDataDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: "João" })
  nivel: string;
};

export class NiveisIndexPaginatedDto {
  @ApiProperty({ type: [NiveisDataDto] })
  data: NiveisDataDto[];
  @ApiProperty({ example: 10 })
  per_page: number;
  @ApiProperty({ example: 1 })
  current_page: number;
  @ApiProperty({ example: 2 })
  last_page: number;
  @ApiProperty({ example: 20 })
  total: number;
}

export class NivelCreateDto {
  @ApiProperty({ example: "João" })
  nivel: string
}

export class NivelUpdateDto {
  @ApiProperty({ example: "João" })
  nivel?: string
}