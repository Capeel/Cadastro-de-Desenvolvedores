import { IsNotEmpty, IsOptional } from "class-validator";

export class DevelopersFormCreate {
  @IsNotEmpty({ message: "Nível deve ser informado" })
  levelsId: number;

  @IsNotEmpty({ message: "Nome deve ser informado" })
  name: string;

  @IsNotEmpty({ message: "Sexo deve ser informado" })
  gender: string;

  @IsNotEmpty({ message: "Data de nascimento deve ser informada" })
  birthday: string;

  @IsNotEmpty({ message: "Hobby deve ser informado" })
  hobby: string;
}

export class DevelopersFormUpdate {
  @IsOptional()
  levelsId: number;

  @IsOptional()
  name: string;

  @IsOptional()
  gender: string;

  @IsOptional()
  birthday: string;

  @IsOptional()
  hobby: string;
}