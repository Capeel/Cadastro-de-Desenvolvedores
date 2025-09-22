export type DesenvolvedorDto = {
  id: number;
  nome: string;
  sexo: string;
  data_nascimento: string;
  hobby: string;
  nivel: {
    id: number;
    nivel: string;
  };
};

export type DesenvolvedorFormDto = {
  id?: number;
  nome: string;
  sexo: string;
  data_nascimento: string;
  hobby: string;
  nivel: { id: number };
}

export type DesenvolvedoresIndexPaginatedDto = {
  data: DesenvolvedorDto[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

export type DesenvolvedoresFilterDto = {
  id?: number;
  nome?: string;
  sexo?: string;
  hobby?: string;
  nivel?: string;
  data_nascimento?: string;
};

export type DesenvolvedoresDataDto = {
  current_page: number;
  per_page: number;
} & DesenvolvedoresFilterDto;