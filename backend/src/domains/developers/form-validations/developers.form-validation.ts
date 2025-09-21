import { IsNotEmpty, IsOptional } from "class-validator";

export class DesenvolvedoresFormCreate {
  @IsNotEmpty({ message: "Nível deve ser informado" })
  nivel: { id: number };

  @IsNotEmpty({ message: "Nome deve ser informado" })
  nome: string;

  @IsNotEmpty({ message: "Sexo deve ser informado" })
  sexo: string;

  @IsNotEmpty({ message: "Data de nascimento deve ser informada" })
  data_nascimento: string;

  @IsNotEmpty({ message: "Hobby deve ser informado" })
  hobby: string;
}

export class DesenvolvedoresFormUpdate {
  @IsOptional()
  nivel: { id: number };

  @IsOptional()
  nome: string;

  @IsOptional()
  sexo: string;

  @IsOptional()
  data_nascimento: string;

  @IsOptional()
  hobby: string;
}

export class DesenvolvedoresIndexQuery {
  @IsOptional()
  nome?: string;

  @IsOptional()
  sexo?: string;

  @IsOptional()
  data_nascimento?: string;

  @IsOptional()
  hobby?: string;

  @IsOptional()
  nivel?: string;

  @IsNotEmpty()
  current_page: number;

  @IsNotEmpty()
  per_page: number;
}