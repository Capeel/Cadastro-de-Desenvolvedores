import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class DesenvolvedoresFormCreate {
  @ApiProperty({
    description: "Id do Nível Cadastrado",
    example: 1,
    required: true
  })
  @IsNotEmpty({ message: "Nível deve ser informado" })
  nivel: { id: number };

  @ApiProperty({
    description: "Nome do Desenvolvedor",
    example: "João",
    required: true
  })
  @IsNotEmpty({ message: "Nome deve ser informado" })
  nome: string;

  @ApiProperty({
    description: "Sexo do Desenvolvedor",
    example: "Masculino",
    required: true
  })
  @IsNotEmpty({ message: "Sexo deve ser informado" })
  sexo: string;

  @ApiProperty({
    description: "Data de Nascimento do Desenvolvedor",
    example: "1995-11-04",
    required: true
  })
  @IsNotEmpty({ message: "Data de nascimento deve ser informada" })
  data_nascimento: string;

  @ApiProperty({
    description: "Hobby do Desenvolvedor",
    example: "Futebol Americano",
    required: true
  })
  @IsNotEmpty({ message: "Hobby deve ser informado" })
  hobby: string;
}

export class DesenvolvedoresFormUpdate {
  @ApiProperty({
    description: "Id do Nível Cadastrado",
    example: 1,
    required: false
  })
  @IsOptional()
  nivel: { id: number };

  @ApiProperty({
    description: "Nome do Desenvolvedor",
    example: "João",
    required: false
  })
  @IsOptional()
  nome: string;

  @ApiProperty({
    description: "Sexo do Desenvolvedor",
    example: "Masculino",
    required: false
  })
  @IsOptional()
  sexo: string;

  @ApiProperty({
    description: "Data de Nascimento do Desenvolvedor",
    example: "1995-11-04",
    required: false
  })
  @IsOptional()
  data_nascimento: string;

  @ApiProperty({
    description: "Hobby do Desenvolvedor",
    example: "Futebol Americano",
    required: false
  })
  @IsOptional()
  hobby: string;
}

export class DesenvolvedoresIndexQuery {
  @ApiProperty({
    description: "Nome do Desenvolvedor",
    example: "João",
    required: false
  })
  @IsOptional()
  nome?: string;

  @ApiProperty({
    description: "Sexo do Desenvolvedor",
    example: "Masculino",
    required: false
  })
  @IsOptional()
  sexo?: string;

  @ApiProperty({
    description: "Hobby do Desenvolvedor",
    example: "Futebol Americano",
    required: false
  })
  @IsOptional()
  hobby?: string;

  @ApiProperty({
    description: "Nível do Desenvolvedor",
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